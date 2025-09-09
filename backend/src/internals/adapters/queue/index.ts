import type QueueRepository from "../../domain/queue/queueRepository.ts";
import {QueueName} from "../../domain/queue";
import {Queue} from 'bullmq';
import type Redis from "ioredis";
import {BadRequestError} from "../../../packages/errors";

export default class BullMQ implements QueueRepository {
    connection: Redis
    resourceAnalysisQueue: Queue
    milestoneGenerationQueue: Queue
    challengeGenerationQueue: Queue

    constructor(connection: Redis) {
        this.connection = connection

        this.resourceAnalysisQueue = new Queue(QueueName.resourceSegmentation, {
            connection,
            defaultJobOptions: {
                attempts: 2,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        })
        this.milestoneGenerationQueue = new Queue(QueueName.milestoneGeneration, {
            connection,
            defaultJobOptions: {
                attempts: 2,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        })
        this.challengeGenerationQueue = new Queue(QueueName.challengeGeneration, {
            connection,
            defaultJobOptions: {
                attempts: 2,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        })
    }

    async addJob(queue: QueueName, data: any) {
        switch (queue) {
            case QueueName.resourceSegmentation:
                await this.resourceAnalysisQueue.add(queue, data);
                break
            case QueueName.milestoneGeneration:
                await this.milestoneGenerationQueue.add(queue, data);
                break
            case QueueName.challengeGeneration:
                await this.challengeGenerationQueue.add(queue, data);
                break
            default:
                throw new BadRequestError("invalid queue")
        }
    }
}