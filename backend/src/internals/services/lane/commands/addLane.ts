import type LaneRepository from "../../../domain/lane/repository.ts";
import {BadRequestError} from "../../../../packages/errors";
import type QueueRepository from "../../../domain/queue/queueRepository.ts";
import type YoutubeRepository from "../../../domain/youtube/repository.ts";
import type {Lane} from "../../../domain/lane";
import AppSecrets from "../../../../packages/secret";
import {QueueName} from "../../../domain/queue";
import type {Youtube} from "../../../domain/resource";
import type ResourceRepository from "../../../domain/resource/repository.ts";
import type ProgressRepository from "../../../domain/progress/repository.ts";

export default class AddLane {
    laneRepository: LaneRepository

    constructor(laneRepository: LaneRepository) {
        this.laneRepository = laneRepository
    }

    async handle(id: string, userId: string): Promise<void> {
        await this.laneRepository.addLane(id, userId)
    }
}