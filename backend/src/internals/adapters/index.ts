import {SQL} from "bun";
import AppSecrets from "../../packages/secret";
import type UserRepository from "../domain/user/repository.ts";
import UserRepositoryPG from "./user";
import type Redis from "ioredis";
import type QueueRepository from "../domain/queue/repository.ts";
import BullMQ from "./queue";

export type AdapterParameters = {
    postgresClient: SQL
    redisClient: Redis
    appSecrets: AppSecrets
}

export default class Adapters {
    userRepository: UserRepository
    queueRepository: QueueRepository

    constructor(parameters: AdapterParameters) {
        this.userRepository = new UserRepositoryPG(parameters.postgresClient)
        this.queueRepository = new BullMQ(parameters.redisClient)
    }
}