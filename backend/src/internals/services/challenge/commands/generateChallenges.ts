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
import type {Challenge} from "../../../domain/challenge";
import {challengePrompt} from "../../../../packages/prompts/challenge.ts";

export default class GenerateChallenge {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    resourceRepository: ResourceRepository
    progressRepository: ProgressRepository
    progressWebsocketRepository: ProgressWebsocketRepository
    llmRepository: LLMRepository
    challengeRepository: ChallengeRepository

    constructor(
        laneRepository: LaneRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository
    ) {
        this.laneRepository = laneRepository
        this.resourceRepository = resourceRepository
        this.appSecrets = appSecrets
        this.progressRepository = progressRepository
        this.progressWebsocketRepository = progressWebsocketRepository
        this.llmRepository = llmRepository
        this.challengeRepository = challengeRepository
    }

    async handle(laneId: string, attempts: number, maxAttempt: number): Promise<void> {
        try {
            await this.sendProgress({
                lane: laneId,
                message: `generating challenges ${attempts > 1 ? "again" : ""}...`,
                type: "success",
            });

            const lane = await this.laneRepository.getById(laneId)
            const messages: Message[] = [
                {text: challengePrompt()},
                {data: {fileUri: `https://www.youtube.com/watch?v=${lane.youtube}`}}
            ];
            const llmResult = await this.llmRepository.getText(messages);
            const challenge = this.extractChallenges(llmResult);
            await this.challengeRepository.add(laneId, challenge);

            await this.sendProgress({
                lane: laneId,
                message: `challenge generation complete`,
                type: "success",
            });
            await this.laneRepository.update(laneId, {state: "completed"});
        } catch (e) {
            console.log(e)
            if (attempts >= maxAttempt) {
                const message = `Failed to generate challenge for lane, retry`;
                await this.updateLaneAsFailed(laneId, message);
            } else {
                await this.sendProgress({
                    lane: laneId,
                    message: `failed to generate challenge, retry scheduled`,
                    type: "info",
                });
                throw e
            }
        }
    }

    private async updateLaneAsFailed(laneId: string, message: string): Promise<void> {
        await this.laneRepository.update(laneId, {state: "failed"});
        await this.sendProgress({
            lane: laneId,
            message,
            type: "fail",
        });
    }

    private extractChallenges(raw: string): Omit<Challenge, "id" | "lane">[] {
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

    private validateChallenges(challenges: Omit<Challenge, "id" | "lane">[]): void {
        for (const c of challenges) {
            if (!c.title || !c.objective || !c.assignment ||
                !c.submissionFormat || !c.successCriteria || !c.instruction ||
                !Array.isArray(c.references)) {
                throw new InvalidChallengesError();
            }
        }
    }

    sendProgress = async (progress: BaseProgress) => {
        await this.progressRepository.add(progress)
        this.progressWebsocketRepository.Broadcast({data: progress}, progress.lane)
    }
}