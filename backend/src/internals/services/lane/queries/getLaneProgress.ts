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
import type {Progress} from "../../../domain/progress";

export default class GetLaneProgress {
    progressRepository: ProgressRepository

    constructor(progressRepository: ProgressRepository) {
        this.progressRepository = progressRepository
    }

    async handle(laneId: string): Promise<Progress[]> {
        return this.progressRepository.get(laneId)
    }
}