import type LaneRepository from "../../../domain/lane/repository.ts";
import {BadRequestError} from "../../../../packages/errors";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type YoutubeRepository from "../../../domain/youtube/repository.ts";
import type {Lane} from "../../../domain/lane";
import AppSecrets from "../../../../packages/secret";
import {QueueName} from "../../../domain/queue";
import type {Youtube} from "../../../domain/resource";
import type ResourceRepository from "../../../domain/resource/repository.ts";

export default class CreateLane {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    youtubeRepository: YoutubeRepository
    resourceRepository: ResourceRepository

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, appSecrets: AppSecrets) {
        this.laneRepository = laneRepository
        this.queueRepository = queueRepository
        this.youtubeRepository = youtubeRepository
        this.resourceRepository = resourceRepository
        this.appSecrets = appSecrets
    }

    async handle(creator: string, youtube: string, startTime?: number, endTime?: number): Promise<string> {
        let video = await this.youtubeRepository.getDetails(youtube)
        if (endTime && endTime > video.duration) throw new BadRequestError(`end time is longer than video`);
        if (startTime && startTime > video.duration) throw new BadRequestError(`start time is longer than video`);
        // const duration = (endTime || video.duration) - (startTime || 0);
        // if (duration > this.appSecrets.maxYoutubeLength) {
        //     throw new BadRequestError(`video: ${youtube} is too long`);
        // }
        let yts = await this.resourceRepository.addYoutubes([video])
        if (!yts[0]) throw new Error("failed to add youtube video")
        let laneId = await this.laneRepository.create(creator, yts[0], startTime, endTime)
        await this.queueRepository.addJob(QueueName.challengeGeneration, {laneId})
        return laneId
    }
}