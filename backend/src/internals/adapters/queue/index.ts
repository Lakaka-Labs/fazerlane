import type QueueRepository from "../../domain/queue/queueRepository.ts";
import {QueueName} from "../../domain/queue";
import {Queue} from 'bullmq';
import type Redis from "ioredis";
import {BadRequestError} from "../../../packages/errors";

export default class BullMQ implements QueueRepository {
    connection: Redis
    resourceAnalysisQueue: Queue
    phaseGenerationQueue: Queue
    lessonGenerationQueue: Queue

    constructor(connection: Redis) {
        this.connection = connection

        this.resourceAnalysisQueue = new Queue(QueueName.resourceAnalysis, {
            connection,
            defaultJobOptions: {attempts: 2},
        })
        this.phaseGenerationQueue = new Queue(QueueName.phaseGeneration, {
            connection,
            defaultJobOptions: {attempts: 2},
        })
        this.lessonGenerationQueue = new Queue(QueueName.lessonGeneration, {
            connection,
            defaultJobOptions: {attempts: 2},
        })
    }

    async addJob(queue: QueueName, data: any) {
        switch (queue) {
            case QueueName.resourceAnalysis:
                await this.resourceAnalysisQueue.add(queue, data);
                return
            case QueueName.phaseGeneration:
                await this.phaseGenerationQueue.add(queue, data);
                return
            case QueueName.lessonGeneration:
                await this.lessonGenerationQueue.add(queue, data);
                return
            default:
                throw new BadRequestError("invalid queue")
        }
    }
}