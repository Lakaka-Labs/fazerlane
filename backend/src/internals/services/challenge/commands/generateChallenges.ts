import AppSecrets from "../../../../packages/secret";
import type LaneRepository from "../../../domain/lane/repository.ts";
import type ResourceRepository from "../../../domain/resource/repository.ts";
import {InvalidChallengesError} from "../../../../packages/errors";
import type {Message} from "../../../domain/llm";
import type ProgressRepository from "../../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../../domain/websocket/repository.ts";
import type {BaseProgress} from "../../../domain/progress";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {type Challenge, convertChallengeToString} from "../../../domain/challenge";
import {challengePrompt} from "../../../../packages/prompts/challenge.ts";
import type {Lane} from "../../../domain/lane";
import type UserRepository from "../../../domain/user/repository.ts";
import type {User} from "../../../domain/user";
import Gemini from "../../../adapters/llm";
import {googleGeminiClient} from "../../../../packages/utils/connections.ts";

type Split = { startTime: number, endTime: number }
export default class GenerateChallenge {

    constructor(
        private readonly laneRepository: LaneRepository,
        private readonly appSecrets: AppSecrets,
        private readonly progressRepository: ProgressRepository,
        private readonly progressWebsocketRepository: ProgressWebsocketRepository,
        private llmRepository: LLMRepository,
        private readonly challengeRepository: ChallengeRepository,
        private readonly userRepository: UserRepository
    ) {
    }

    async handle(laneId: string, attempts: number, maxAttempt: number): Promise<void> {
        try {
            await this.sendProgress({
                lane: laneId,
                message: `generating`,
                type: "success",
            });
            let totalInput = 0
            let totalOutput = 0
            const lane = await this.laneRepository.getById(laneId)
            const user = await this.userRepository.get({id: lane.creator})

            let splits = lane.youtubeDetails?.duration ? this.splitDuration(lane.youtubeDetails?.duration) : []
            for await (const split of splits
                ) {
                const {inputToken, outputToken} = await this.withRetry(() => this.generate(split, lane, user));
                totalOutput += outputToken
                totalInput += inputToken
            }
            await this.sendProgress({
                lane: laneId,
                message: `completed`,
                type: "success",
            });
            await this.laneRepository.update(laneId, {state: "completed"});
        } catch
            (e) {
            console.log(e)
            await this.challengeRepository.remove(laneId);
            if (attempts >= maxAttempt) {
                const message = `failed`;
                await this.updateLaneAsFailed(laneId, message);
            } else {
                await this.sendProgress({
                    lane: laneId,
                    message: `regenerating`,
                    type: "info",
                });
                throw e
            }
        }
    }

    async withRetry<T>(fn: () => Promise<T>, maxAttempts: number = 3, baseDelay: number = 61000): Promise<T> {
        let lastError
            :
            Error;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                return await fn();
            } catch (e) {
                lastError = e instanceof Error ? e : new Error(String(e));
                const isLastAttempt = attempt === maxAttempts - 1;

                console.log(
                    `Attempt ${attempt + 1}/${maxAttempts} failed:`,
                    lastError.message
                );

                if (isLastAttempt) throw lastError;

                // Exponential backoff
                const delay = baseDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

// TypeScript requires this, though it's unreachable
        throw lastError!;
    }

    private generate = async (split: Split, lane: Lane, user: User): Promise<{
        inputToken: number,
        outputToken: number
    }> => {
        let customPrompt = user.customPrompt
        let previousChallenges = await this.challengeRepository.get(lane.id)
        const messages: Message[] = [
            {text: customPrompt || ""},
            {text: challengePrompt(previousChallenges)},
            {
                data: {
                    fileUri: `https://www.youtube.com/watch?v=${lane.youtube}`,
                    ...(split.startTime && {startOffset: split.startTime}),
                    ...(split.endTime && {endOffset: split.endTime}),
                }
            }
        ];
        const inputToken = await this.llmRepository.getTokens(messages);
        if (user.apiKey) {
            this.llmRepository = new Gemini(googleGeminiClient(user.apiKey), this.appSecrets)
        }
        const {response: llmResult, tokenCount: outputToken} = await this.llmRepository.getText(messages);
        const challenges = this.extractChallenges(llmResult);
        const embeddings = await this.llmRepository.generateEmbedding(challenges.map((c) => {
            return convertChallengeToString(c)
        }))
        await this.challengeRepository.add(lane.id, challenges.map((c, i) => {
            return {...c, embedding: embeddings[i]?.embedding || []}
        }));
        await new Promise(resolve => setTimeout(resolve, 61000))
        return {inputToken, outputToken}
    }

    private async updateLaneAsFailed(laneId: string, message: string): Promise<void> {
        await this.laneRepository.update(laneId, {state: "failed"});
        await this.sendProgress({
            lane: laneId,
            message,
            type: "fail",
        });
    }

    private extractChallenges(raw: string):
        Omit<Challenge, "id" | "lane"> [] {
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidChallengesError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        const challenges = JSON.parse(jsonString) as Challenge[];

        if (!Array.isArray(challenges)) {
            throw new InvalidChallengesError();
        }

        this.validateChallenges(challenges);
        return challenges;
    }

    private validateChallenges(challenges: Omit<Challenge, "id" | "lane"> []): void {
        for (const c of challenges
            ) {
            if (!c.title || !c.objective || !c.assignment ||
                !Array.isArray(c.submissionFormat) || !c.difficulty || !c.instruction ||
                !Array.isArray(c.references)) {
                throw new InvalidChallengesError();
            }
        }
    }

    private sendProgress = async (progress: BaseProgress) => {
        await this.progressRepository.add(progress)
        this.progressWebsocketRepository.Broadcast({data: progress}, progress.lane)
    }


    private splitDuration = (duration: number, maxLength: number = 1800): Split[] => {
        const segments: { startTime: number, endTime: number }[] = [];

        let currentTime = 0;

        while (currentTime < duration) {
            const startTime = currentTime;
            const endTime = Math.min(currentTime + maxLength, duration);

            segments.push({
                startTime: startTime,
                endTime: endTime
            });

            currentTime = endTime + 1;
        }

        return segments;
    };
}