import AppSecrets from "../../../../packages/secret";
import type LaneRepository from "../../../domain/lane/repository.ts";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type ResourceRepository from "../../../domain/resource/repository.ts";
import {DuplicateError, InvalidSegmentsError} from "../../../../packages/errors";
import {getSegmentPrompt} from "../../../../packages/prompts/segment.ts";
import type {Message} from "../../../domain/llm";
import type {Segment, Youtube} from "../../../domain/resource";
import type ProgressRepository from "../../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../../domain/websocket/repository.ts";
import type {BaseProgress} from "../../../domain/progress";
import type LLMRepository from "../../../domain/llm/repository.ts";
import {QueueName} from "../../../domain/queue";

export default class SegmentLaneResources {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    resourceRepository: ResourceRepository
    progressRepository: ProgressRepository
    progressWebsocketRepository: ProgressWebsocketRepository
    llmRepository: LLMRepository

    constructor(
        laneRepository: LaneRepository,
        queueRepository: QueueRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository
    ) {
        this.laneRepository = laneRepository
        this.queueRepository = queueRepository
        this.resourceRepository = resourceRepository
        this.appSecrets = appSecrets
        this.progressRepository = progressRepository
        this.progressWebsocketRepository = progressWebsocketRepository
        this.llmRepository = llmRepository
    }

    async handle(laneId: string, attemps: number, maxAttempt: number): Promise<boolean> {
        await this.sendProgress({
            lane: laneId,
            message: `content analysis in progress`,
            type: "success",
            stage: "analysis"
        });

        const {youtubes: ytIds} = await this.laneRepository.getById(laneId);
        const youtubes = await this.resourceRepository.getYoutubes(ytIds);

        if (youtubes.length === 0) {
            await this.updateLaneAsFailed(laneId, "No content found - need some content to work with!");
            return false;
        }

        let hasRetry = false;
        const failedVideos: string[] = [];

        for (const youtube of youtubes) {
            try {
                if (!youtube.segmented) {
                    await this.processYoutubeSegmentation(youtube);

                    await this.sendProgress({
                        lane: laneId,
                        message: `Analysis done: ${youtube.title}`,
                        type: "success",
                        stage: "analysis"
                    });
                } else {
                    if (attemps == 1) {
                        await this.sendProgress({
                            lane: laneId,
                            message: `Analysis done: ${youtube.title}`,
                            type: "success",
                            stage: "analysis"
                        });
                    }
                }

            } catch (error) {
                console.log({error})
                if (error instanceof DuplicateError) {
                    continue;
                }

                if (attemps >= maxAttempt) {
                    failedVideos.push(youtube.title);
                    await this.sendProgress({
                        lane: laneId,
                        message: `"${youtube.title}" could not be segmented after ${maxAttempt} attempts`,
                        type: "fail",
                        stage: "analysis"
                    });
                } else {
                    await this.sendProgress({
                        lane: laneId,
                        message: `"${youtube.title}" hit a snag, retry scheduled`,
                        type: "info",
                        stage: "analysis"
                    });
                    hasRetry = true;
                }
            }
        }

        // If we've reached max attempts and have failed videos, fail the lane
        if (attemps >= maxAttempt && failedVideos.length > 0) {
            const message = `Analysis failed - ${failedVideos.length} content(s) could not be segmented: ${failedVideos.join(', ')}`;
            await this.updateLaneAsFailed(laneId, message);
            return false;
        }

        if (!hasRetry) {
            await this.sendProgress({
                lane: laneId,
                message: `Lane analysis complete`,
                type: "success",
                stage: "analysis"
            });
            await this.laneRepository.update(laneId, {state: "context-analysed"});
            await this.queueRepository.addJob(QueueName.milestoneGeneration, {laneId});
        }

        return hasRetry;
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

    private async processYoutubeSegmentation(youtube: Youtube): Promise<void> {
        const messages: Message[] = [
            {text: getSegmentPrompt()},
            {data: {fileUri: `https://www.youtube.com/watch?v=${youtube.id}`}}
        ];
        const llmResult = await this.llmRepository.getText(messages);
        const segments = this.extractSegments(llmResult);
        await this.resourceRepository.addSegment(segments, youtube.id);
    }

    private extractSegments(raw: string): Segment[] {
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/) ||
            raw.match(/\[\s*{[\s\S]*}\s*\]/);

        if (!jsonMatch) {
            throw new InvalidSegmentsError();
        }

        const jsonString = jsonMatch[1]?.trim() || jsonMatch[0];
        const segments = JSON.parse(jsonString) as Segment[];

        if (!Array.isArray(segments)) {
            throw new InvalidSegmentsError();
        }

        this.validateSegments(segments);
        return segments;
    }

    private validateSegments(segments: Segment[]): void {
        for (const segment of segments) {
            if (!segment.startTime || !segment.endTime || !segment.title ||
                !segment.summary || !Array.isArray(segment.learningObjectives) ||
                !Array.isArray(segment.visualElements) || !segment.transcription) {
                throw new InvalidSegmentsError();
            }
        }
    }

    sendProgress = async (progress: BaseProgress) => {
        await this.progressRepository.add(progress)
        this.progressWebsocketRepository.Broadcast({data: progress}, progress.lane)
    }
}