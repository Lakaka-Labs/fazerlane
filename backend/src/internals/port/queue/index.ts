import {Worker} from 'bullmq';
import type Redis from "ioredis";
import type Services from "../../services";
import type AppSecrets from "../../../packages/secret";
import {QueueName} from "../../domain/queue";
import ResourceAnalysis from "./resourceAnalysis";
import milestoneGeneration from "./milestoneGeneration";
import challengeGeneration from "./challengeGeneration";

export default class BullMQueue {
    connection: Redis
    appSecrets: AppSecrets
    services: Services

    constructor(appSecrets: AppSecrets, services: Services, connection: Redis) {
        this.appSecrets = appSecrets
        this.services = services
        this.connection = connection

        this.resourceAnalysis()
        this.milestoneGeneration()
        this.challengeGeneration()
    }

    resourceAnalysis = () => {
        const worker = new Worker(QueueName.resourceSegmentation, new ResourceAnalysis(this.services.resourceService).handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
            // console.log({job: job.data, completed: "completed"})
        });
        worker.on('failed', (job, err) => {
            // console.log({job: job?.data, failed: "failed"})
        });
    }

    milestoneGeneration = () => {
        const worker = new Worker(QueueName.milestoneGeneration, new milestoneGeneration().handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }

    challengeGeneration = () => {
        const worker = new Worker(QueueName.challengeGeneration, new challengeGeneration().handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }
}