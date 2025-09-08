import {SQL} from "bun";
import AppSecrets from "../../packages/secret";
import type UserRepository from "../domain/user/repository.ts";
import UserRepositoryPG from "./user";
import type Redis from "ioredis";
import type QueueRepository from "../domain/queue/queueRepository.ts";
import BullMQ from "./queue";
import type YoutubeRepository from "../domain/youtube/repository.ts";
import Youtube from "./youtube";
import LaneRepositoryPG from "./lane";
import type LaneRepository from "../domain/lane/repository.ts";

export type AdapterParameters = {
    postgresClient: SQL
    redisClient: Redis
    appSecrets: AppSecrets
}

export default class Adapters {
    parameters: AdapterParameters
    userRepository: UserRepository
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    youtubeRepository: YoutubeRepository

    constructor(parameters: AdapterParameters) {
        this.parameters = parameters
        this.userRepository = new UserRepositoryPG(parameters.postgresClient)
        this.laneRepository = new LaneRepositoryPG(parameters.postgresClient)
        this.queueRepository = new BullMQ(parameters.redisClient)
        this.youtubeRepository = new Youtube(parameters.appSecrets.googleAPIKey, parameters.appSecrets.baseYoutubeApiUrl)
    }
}