import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {
    BadRequestError,
    InvalidAssessmentsError,
} from "../../../../packages/errors";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {Message, ModelResponse} from "../../../domain/llm";
import {submissionPrompt} from "../../../../packages/prompts/submission.ts";
import type {Attempt, Challenge, SubmissionFormat} from "../../../domain/challenge";
import type XPRepository from "../../../domain/xp/repository.ts";
import type AppSecrets from "../../../../packages/secret";
import {XPType} from "../../../domain/xp";
import type {StorageObject} from "../../../domain/objects";
import type {ObjectRepository} from "../../../domain/objects/repository.ts";
import {isValidSubmissionType} from "../../../../packages/utils/mime.ts";
import type {MemoriesRepository} from "../../../domain/memories/repository.ts";
import {formatHumanReadableTimestamp} from "../../../../packages/utils/time.ts";

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

const ATTEMPTS_FETCH_LIMIT = 20;
const RECENT_CHALLENGES_LIMIT = 10;

export default class MarkChallenge {
    constructor(
        private readonly challengeRepository: ChallengeRepository,
        private readonly llmRepository: LLMRepository,
        private readonly xpRepository: XPRepository,
        private readonly appSecret: AppSecrets,
        private readonly objectRepository: ObjectRepository,
        private readonly attemptMemoriesRepository: MemoriesRepository
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

        let storageObjects: StorageObject[] | undefined
        if (parameter.files?.length) {
            storageObjects = await this.getStorageObjects(parameter.files, challenge.submissionFormat)
        }

        const generator = this.streamMark(parameter, challenge, isCompleted, storageObjects);

        return {generator, challengeId: id};
    }

    private async getStorageObjects(files: string[], submissionFormat: SubmissionFormat[]): Promise<StorageObject[]> {
        const storageObjects = await this.objectRepository.get(files);
        for (const storageObject of storageObjects) {
            if (!isValidSubmissionType(storageObject.mimeType, submissionFormat)) {
                throw new BadRequestError(`invalid submission, only upload ${submissionFormat.join(", ")}`)
            }
        }
        return storageObjects
    }

    private async* streamMark(
        parameter: MarkChallengeParameters,
        challenge: Challenge,
        completed: boolean,
        storageObjects?: StorageObject[],
    ): AsyncGenerator<string> {
        const {id, userId, text, comment, signal} = parameter;

        try {
            // Fetch all required data in parallel
            const [previousFeedbacks, recentChallenges, nextChallenge] = await Promise.all([
                parameter.useMemory ? this.challengeRepository.getAttempts(id, userId, {
                    limit: ATTEMPTS_FETCH_LIMIT,
                    page: 1
                }) : [],
                this.challengeRepository.get(challenge.lane, undefined, {
                    toPosition: challenge.position - 1,
                    order: "desc",
                    limit: RECENT_CHALLENGES_LIMIT
                }),
                this.challengeRepository.getByPosition(challenge.lane, challenge.position + 1)
            ]);

            // Build prompt messages
            const promptMessage = await this.buildPromptMessages(
                challenge,
                recentChallenges,
                nextChallenge,
                previousFeedbacks,
                text,
                comment,
                storageObjects
            );

            // Get input token count
            const inputCount = await this.llmRepository.getTokens(promptMessage);
            console.log({inputCount});

            // Start streaming
            const streamResult = this.llmRepository.getTextStream([{role: "user", messages: promptMessage}], signal);

            let fullResponse = '';
            let lastTokenCount = 0;

            // Stream chunks to client
            for await (const chunk of streamResult) {
                const text = chunk.response;
                fullResponse += text;
                lastTokenCount = chunk.tokenCount;

                yield JSON.stringify({
                    type: 'chunk',
                    data: text,
                    challengeId: id
                });
            }

            console.log({outputToken: lastTokenCount});

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
                throw error; // Re-throw to let caller handle if needed
            }
        }
    }

    private async buildPromptMessages(
        challenge: Challenge,
        recentChallenges: Challenge[],
        nextChallenge: Challenge | null,
        previousFeedbacks: any[],
        text?: string,
        comment?: string,
        storageObjects?: StorageObject[],
    ): Promise<Message[]> {
        const messages: Message[] = [{
            text: submissionPrompt(challenge, recentChallenges, nextChallenge, previousFeedbacks, text)
        }];

        if (storageObjects?.length) {
            messages.push(...storageObjects.map((object) => {
                return {
                    uploadedData: {uri: object.llmUrl, mimeType: object.mimeType}
                }
            }));
        }

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
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidAssessmentsError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];

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
}