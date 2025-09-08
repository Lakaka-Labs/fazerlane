import {Worker} from 'bullmq';
import type Redis from "ioredis";
import type Services from "../../services";
import type AppSecrets from "../../../packages/secret";
import {QueueName} from "../../domain/queue";
import ResourceAnalysis from "./resourceAnalysis";
import PhaseGeneration from "./phaseGeneration";
import LessonGeneration from "./lessonGeneration";

export default class BullMQueue {
    connection: Redis
    appSecrets: AppSecrets
    services: Services

    constructor(appSecrets: AppSecrets, services: Services,connection: Redis) {
        this.appSecrets = appSecrets
        this.services = services
        this.connection = connection

        this.resourceAnalysis()
        this.phaseGeneration()
        this.lessonGeneration()
    }

    resourceAnalysis = () => {
        const worker = new Worker(QueueName.resourceAnalysis, new ResourceAnalysis().handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }

    phaseGeneration = () => {
        const worker = new Worker(QueueName.phaseGeneration, new PhaseGeneration().handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }

    lessonGeneration = () => {
        const worker = new Worker(QueueName.lessonGeneration, new LessonGeneration().handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }
}