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

    async handle(lane: Omit<Lane, "id" | "createdAt" | "updatedAt">): Promise<string> {
        let youtubes: Youtube[] = []
        for await (const id of lane.youtubes) {
            try {
                let video = await this.youtubeRepository.getDetails(id)
                if (video.duration > this.appSecrets.maxVideoLength) throw new BadRequestError(`video: ${id} is too long`)
                youtubes.push({...video, segmented: false})
            } catch (e) {
                throw e
            }
        }

        lane.youtubes = await this.resourceRepository.addYoutubes(youtubes)
        let laneId = await this.laneRepository.create(lane)
        await this.queueRepository.addJob(QueueName.resourceSegmentation, {laneId})
        return laneId
    }
}