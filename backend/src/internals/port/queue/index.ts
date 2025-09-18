import {Worker} from 'bullmq';
import type Redis from "ioredis";
import type Services from "../../services";
import type AppSecrets from "../../../packages/secret";
import {QueueName} from "../../domain/queue";
import challengeGeneration from "./challengeGeneration";

export default class BullMQueue {
    connection: Redis
    appSecrets: AppSecrets
    services: Services

    constructor(appSecrets: AppSecrets, services: Services, connection: Redis) {
        this.appSecrets = appSecrets
        this.services = services
        this.connection = connection

        this.challengeGeneration()
    }

    challengeGeneration = () => {
        const worker = new Worker(QueueName.challengeGeneration, new challengeGeneration(this.services.challengeService).handler, {
            connection: this.connection,
            concurrency: 150
        });
        worker.on('completed', (job, result) => {
        });
        worker.on('failed', (job, err) => {
        });
    }
}