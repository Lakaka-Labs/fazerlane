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
import type ChallengeRepository from "../../../domain/challenge/repository.ts";

export default class RedoLane {

    constructor(
        private readonly laneRepository: LaneRepository,
        private readonly queueRepository: QueueRepository,
        private readonly progressRepository: ProgressRepository,
        private readonly challengeRepository: ChallengeRepository
    ) {
    }

    async handle(id: string): Promise<void> {
        const original = await this.laneRepository.getById(id)
        if (original.state != "failed" && original.state != "completed") throw new BadRequestError("you can only redo a completed or failed lane")
        await this.progressRepository.delete(id)
        await this.challengeRepository.remove(id)
        await this.laneRepository.update(id, {state: "accepted"})
        await this.queueRepository.addJob(QueueName.challengeGeneration, {laneId: id})
    }
}