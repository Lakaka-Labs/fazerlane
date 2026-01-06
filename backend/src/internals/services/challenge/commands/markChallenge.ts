import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {AIRateLimitError, BadRequestError, InvalidAssessmentsError,} from "../../../../packages/errors";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {Message} from "../../../domain/llm";
import {submissionPrompt} from "../../../../packages/prompts/submission.ts";
import type {Challenge, SubmissionFormat} from "../../../domain/challenge";
import type XPRepository from "../../../domain/xp/repository.ts";
import type AppSecrets from "../../../../packages/secret";
import {XPType} from "../../../domain/xp";
import type {StorageObject} from "../../../domain/objects";
import type {ObjectRepository} from "../../../domain/objects/repository.ts";
import type {MemoriesRepository} from "../../../domain/memories/repository.ts";
import {formatHumanReadableTimestamp} from "../../../../packages/utils/time.ts";
import type UserRepository from "../../../domain/user/repository.ts";
import Gemini from "../../../adapters/llm";
import {googleGeminiClient} from "../../../../packages/utils/connections.ts";
import {isValidSubmissionType} from "../../../../packages/utils/mime.ts";
import type LaneRepository from "../../../domain/lane/repository.ts";
import type {Lane} from "../../../domain/lane";

export type MarkChallengeParameters = {
    id: string;
    userId: string;
    files?: string[];
    text?: string;
    comment?: string;
    useMemory?: boolean;
    signal?: AbortSignal;
}

type MarkResult = {
    pass: boolean;
    feedback: string;
}

type RetryConfig = {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    retryableErrors?: string[];
}

const ATTEMPTS_FETCH_LIMIT = 20;
const RECENT_CHALLENGES_LIMIT = 10;

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
};

export default class MarkChallenge {
    constructor(
        private readonly challengeRepository: ChallengeRepository,
        private llmRepository: LLMRepository,
        private readonly xpRepository: XPRepository,
        private readonly appSecret: AppSecrets,
        private readonly objectRepository: ObjectRepository,
        private readonly attemptMemoriesRepository: MemoriesRepository,
        private readonly userRepository: UserRepository,
        private readonly appSecrets: AppSecrets,
        private readonly laneRepository: LaneRepository,
        private readonly retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG,
    ) {
    }

    async handle(parameter: MarkChallengeParameters): Promise<{
        generator: AsyncGenerator<string>;
        challengeId: string;
    }> {
        const {id, userId} = parameter;

        const challenge = await this.challengeRepository.getById(id);
        const completedChallenges = await this.challengeRepository.getCompletedChallenges(
            challenge.lane,
            userId
        );
        const isCompleted = completedChallenges.includes(challenge.id);

        const lane = await this.laneRepository.getById(challenge.lane)

        let storageObjects: StorageObject[] | undefined
        if (parameter.files?.length) {
            storageObjects = await this.getStorageObjects(parameter.files, challenge.submissionFormat)
        }

        const generator = this.streamMark(parameter, challenge, isCompleted, lane, storageObjects,);

        return {generator, challengeId: id};
    }

    private async getStorageObjects(files: string[], submissionFormat: SubmissionFormat[]): Promise<StorageObject[]> {
        let storageObjects = await this.objectRepository.get(files)
        for (const storageObject of storageObjects) {
            if (!isValidSubmissionType(storageObject.mimeType, submissionFormat)) {
                throw new BadRequestError(`invalid submission, only upload ${submissionFormat.join(", ")}`)
            }
        }
        return storageObjects
    }

    private calculateBackoffDelay(attempt: number): number {
        const exponentialDelay = this.retryConfig.baseDelayMs * Math.pow(2, attempt);
        const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
        return Math.min(exponentialDelay + jitter, this.retryConfig.maxDelayMs);
    }

    private async sleep(ms: number, signal?: AbortSignal): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            signal?.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException());
            });
        });
    }

    private async* streamWithRetry(
        promptMessage: Message[],
        signal?: AbortSignal
    ): AsyncGenerator<{ response: string; tokenCount: number }> {
        let lastError: Error | null = null;
        let useFastModel = false

        for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = this.calculateBackoffDelay(attempt - 1);
                    await this.sleep(delay, signal);
                }

                const streamResult = this.llmRepository.getTextStream(
                    [{role: "user", messages: promptMessage}],
                    useFastModel,
                    signal
                );

                for await (const chunk of streamResult) {
                    yield chunk;
                }

                // Stream completed successfully
                return;

            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                // Don't retry on abort
                if (lastError.name === 'AbortError') {
                    throw lastError;
                }

                if (lastError instanceof AIRateLimitError) {
                    useFastModel = true
                }

                // Check if error is retryable
                // if (!this.isRetryableError(error)) {
                //     console.error('Non-retryable error encountered:', lastError.message);
                //     throw lastError;
                // }

                console.warn(
                    `Stream error on attempt ${attempt + 1}/${this.retryConfig.maxRetries + 1}:`,
                    lastError.message
                );

                // If this was the last attempt, throw the error
                if (attempt === this.retryConfig.maxRetries) {
                    console.error(`All ${this.retryConfig.maxRetries + 1} attempts failed`);
                    throw lastError;
                }
            }
        }

        // This should never be reached, but just in case
        throw lastError ?? new Error('Stream failed after all retries');
    }

    private async* streamMark(
        parameter: MarkChallengeParameters,
        challenge: Challenge,
        completed: boolean,
        lane: Lane,
        storageObjects?: StorageObject[],
    ): AsyncGenerator<string> {
        const {id, userId, text, comment, signal} = parameter;

        try {
            // Fetch all required data in parallel
            const [previousFeedbacks, recentChallenges, nextChallenge, user] = await Promise.all([
                parameter.useMemory ? this.challengeRepository.getAttempts(id, userId, {
                    limit: ATTEMPTS_FETCH_LIMIT,
                    page: 1
                }) : [],
                this.challengeRepository.get(challenge.lane, undefined, {
                    toPosition: challenge.position - 1,
                    order: "desc",
                    limit: RECENT_CHALLENGES_LIMIT
                }),
                this.challengeRepository.getByPosition(challenge.lane, challenge.position + 1),
                this.userRepository.get({id: userId})
            ]);

            // Build prompt messages
            const promptMessage = await this.buildPromptMessages(
                challenge,
                recentChallenges,
                nextChallenge,
                previousFeedbacks,
                lane,
                text,
                comment,
                storageObjects,
                user.customPrompt
            );

            // Get input token count
            const inputCount = await this.llmRepository.getTokens(promptMessage);
            if (user.apiKey) {
                this.llmRepository = new Gemini(googleGeminiClient(user.apiKey), this.appSecrets)
            }

            let fullResponse = '';
            let lastTokenCount = 0;

            // Stream chunks to client with retry logic
            for await (const chunk of this.streamWithRetry(promptMessage, signal)) {
                const text = chunk.response;
                fullResponse += text;
                lastTokenCount = chunk.tokenCount;

                yield JSON.stringify({
                    type: 'chunk',
                    data: text,
                    challengeId: id
                });
            }

            // Extract assessment from complete response
            const {pass, feedback} = this.extractAssessment(fullResponse);

            // Yield completion with final result immediately
            yield JSON.stringify({
                type: 'complete',
                pass,
                feedback,
                challengeId: id
            });

            // Run background tasks without awaiting (fire and forget)
            Promise.all([
                this.xpRepository.streak(userId),
                pass && !completed ? this.giveXP(id, userId, challenge.title, challenge.difficulty) : Promise.resolve(),
                this.challengeRepository.addAttempt({
                    challengeId: id,
                    userId,
                    feedback,
                    pass,
                    comment,
                    files: parameter.files,
                    textSubmission: text
                }),
                this.addToMemory(userId, challenge, feedback, pass)
            ]).catch(error => {
                console.error('Background task error after streaming:', error);
            });

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                yield JSON.stringify({
                    type: 'aborted',
                    challengeId: id
                });
            } else {
                yield JSON.stringify({
                    type: 'error',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    challengeId: id
                });
                throw error;
            }
        }
    }

    private async buildPromptMessages(
        challenge: Challenge,
        recentChallenges: Challenge[],
        nextChallenge: Challenge | null,
        previousFeedbacks: any[],
        lane: Lane,
        text?: string,
        comment?: string,
        storageObjects?: StorageObject[],
        customPrompt?: string
    ): Promise<Message[]> {
        const messages: Message[] = [
            {
                text: submissionPrompt(challenge, recentChallenges, nextChallenge, previousFeedbacks, text),
            }
        ];

        if (challenge.references?.length > 0) {
            messages.push(...challenge.references.map((ref) => {
                return {
                    data: {
                        fileUri: `https://www.youtube.com/watch?v=${lane.youtube}`,
                        ...(ref.location.startTime && {startOffset: this.toSeconds(ref.location.startTime)}),
                        ...(ref.location.endTime && {endOffset: this.toSeconds(ref.location.endTime)}),
                    }
                }
            }));
        }

        if (storageObjects?.length) {
            messages.push(...storageObjects.map((object) => {
                return {
                    uploadedData: {uri: object.llmUrl, mimeType: object.mimeType}
                }
            }));
        }
        if (customPrompt) messages.push({text: customPrompt})
        return messages;
    }

    private async giveXP(
        challengeId: string,
        userId: string,
        title: string,
        difficulty: string
    ): Promise<void> {
        const attemptsCount = await this.challengeRepository.getTotalAttemptCount(challengeId, userId);
        const loss = attemptsCount * this.appSecret.xpPoints.deductPerFail;

        const baseXP = this.getBaseXPForDifficulty(difficulty);
        const finalXP = Math.max(1, baseXP - loss);

        await this.xpRepository.addXP({
            userId,
            amount: finalXP,
            type: XPType.challenge,
            description: `completion of ${title}`,
        });
    }

    private getBaseXPForDifficulty(difficulty: string): number {
        const xpMap: Record<string, number> = {
            easy: this.appSecret.xpPoints.easy,
            medium: this.appSecret.xpPoints.medium,
            hard: this.appSecret.xpPoints.hard
        };

        return xpMap[difficulty] ?? 0;
    }

    private extractAssessment(raw: string): MarkResult {
        console.log(raw)
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        let jsonString = ""
        if (!jsonMatch) {
            jsonString = raw
        } else {
            jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        }
        let parsed: any;
        try {
            parsed = JSON.parse(jsonString);
        } catch {
            throw new InvalidAssessmentsError();
        }

        const {pass, feedback} = parsed;

        if (typeof pass !== 'boolean' || !feedback) {
            throw new InvalidAssessmentsError();
        }

        return {pass, feedback};
    }

    private async addToMemory(userId: string, challenge: Challenge, feedback: string, pass: boolean): Promise<void> {
        const timestamp = formatHumanReadableTimestamp(new Date());

        let message = `title: ${challenge.title} | objective: ${challenge.objective} | feedback: ${feedback} | pass: ${pass} | timestamp: ${timestamp}`;

        await this.attemptMemoriesRepository.add(message, userId)
    }

    private toSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':').map(Number);
        return parts.length === 3
            ? parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
            : parts[0]! * 60 + parts[1]!;
    }
}