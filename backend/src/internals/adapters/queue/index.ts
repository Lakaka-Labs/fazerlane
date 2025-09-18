import type QueueRepository from "../../domain/queue/queueRepository.ts";
import {QueueName} from "../../domain/queue";
import {Queue} from 'bullmq';
import type Redis from "ioredis";
import {BadRequestError} from "../../../packages/errors";

export default class BullMQ implements QueueRepository {
    connection: Redis
    challengeGenerationQueue: Queue

    constructor(connection: Redis) {
        this.connection = connection

        this.challengeGenerationQueue = new Queue(QueueName.challengeGeneration, {
            connection,
            defaultJobOptions: {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        })
    }

    async addJob(queue: QueueName, data: any) {
        switch (queue) {
            case QueueName.challengeGeneration:
                await this.challengeGenerationQueue.add(queue, data);
                break
            default:
                throw new BadRequestError("invalid queue")
        }
    }
}