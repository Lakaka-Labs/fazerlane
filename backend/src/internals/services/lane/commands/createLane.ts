import type LaneRepository from "../../../domain/lane/repository.ts";
import {BadRequestError, NotFoundError} from "../../../../packages/errors";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type YoutubeRepository from "../../../domain/youtube/repository.ts";
import type {Lane, Youtube} from "../../../domain/lane";
import AppSecrets from "../../../../packages/secret";

export default class CreateLane {
    appSecrets: AppSecrets
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    youtubeRepository: YoutubeRepository

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, appSecrets: AppSecrets) {
        this.laneRepository = laneRepository
        this.queueRepository = queueRepository
        this.youtubeRepository = youtubeRepository
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

        let laneId = await this.laneRepository.create(lane, youtubes)
        return laneId
    }
}