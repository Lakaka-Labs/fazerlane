import AppSecrets from "../../../../packages/secret";
import type LaneRepository from "../../../domain/lane/repository.ts";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type ResourceRepository from "../../../domain/resource/repository.ts";
import {InvalidMilestonesError} from "../../../../packages/errors";
import {getMilestonePrompt} from "../../../../packages/prompts/milestone.ts";
import type {Message} from "../../../domain/llm";
import type ProgressRepository from "../../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../../domain/websocket/repository.ts";
import type {BaseProgress} from "../../../domain/progress";
import type LLMRepository from "../../../domain/llm/repository.ts";
import {QueueName} from "../../../domain/queue";
import type {Milestone} from "../../../domain/milestone";
import type MilestoneRepository from "../../../domain/milestone/repository.ts";

export default class GenerateMilestone {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    resourceRepository: ResourceRepository
    progressRepository: ProgressRepository
    progressWebsocketRepository: ProgressWebsocketRepository
    llmRepository: LLMRepository
    milestoneRepository: MilestoneRepository

    constructor(
        laneRepository: LaneRepository,
        queueRepository: QueueRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        milestoneRepository: MilestoneRepository
    ) {
        this.laneRepository = laneRepository
        this.queueRepository = queueRepository
        this.resourceRepository = resourceRepository
        this.appSecrets = appSecrets
        this.progressRepository = progressRepository
        this.progressWebsocketRepository = progressWebsocketRepository
        this.llmRepository = llmRepository
        this.milestoneRepository = milestoneRepository
    }

    async handle(laneId: string, attempts: number, maxAttempt: number): Promise<void> {
        try {
            await this.sendProgress({
                lane: laneId,
                message: `generating milestones ${attempts > 1 ? "again":""}...`,
                type: "success",
                stage: "milestone_generation"
            });

            const lane = await this.laneRepository.getById(laneId)
            const segments = await this.resourceRepository.getSegment(lane.youtubes)

            const messages: Message[] = [
                {text: getMilestonePrompt(lane, segments)},
            ];
            const llmResult = await this.llmRepository.getText(messages);
            const milestones = this.extractMilestones(llmResult);
           await this.milestoneRepository.add(laneId, milestones);

            await this.sendProgress({
                lane: laneId,
                message: `milestones generation complete`,
                type: "success",
                stage: "milestone_generation"
            });
            await this.laneRepository.update(laneId, {state: "milestone-generated"});
            await this.queueRepository.addJob(QueueName.challengeGeneration, {laneId});
        } catch (e) {
            console.log(e)
            if (attempts >= maxAttempt) {
                const message = `Failed to generate milestones for lane, retry`;
                await this.updateLaneAsFailed(laneId, message);
            } else {
                await this.sendProgress({
                    lane: laneId,
                    message: `failed to generate milestones, retry scheduled`,
                    type: "info",
                    stage: "analysis"
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
            stage: "analysis"
        });
    }

    private extractMilestones(raw: string): Omit<Milestone, "id" | "lane">[] {
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidMilestonesError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        const milestones = JSON.parse(jsonString) as Milestone[];

        if (!Array.isArray(milestones)) {
            throw new InvalidMilestonesError();
        }

        this.validateMilestones(milestones);
        return milestones;
    }

    private validateMilestones(milestones: Omit<Milestone, "id" | "lane">[]): void {
        for (const milestone of milestones) {
            if (!milestone.goal || !milestone.description || !milestone.estimatedDuration || !Array.isArray(milestone.recommendedResources)) {
                throw new InvalidMilestonesError();
            }
        }
    }

    sendProgress = async (progress: BaseProgress) => {
        await this.progressRepository.add(progress)
        this.progressWebsocketRepository.Broadcast({data: progress}, progress.lane)
    }
}