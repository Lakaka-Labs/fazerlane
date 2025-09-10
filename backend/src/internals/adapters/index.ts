import {SQL} from "bun";
import AppSecrets from "../../packages/secret";
import type UserRepository from "../domain/user/repository.ts";
import UserRepositoryPG from "./user";
import type Redis from "ioredis";
import type QueueRepository from "../domain/queue/queueRepository.ts";
import BullMQ from "./queue";
import type YoutubeRepository from "../domain/youtube/repository.ts";
import Youtube from "./youtube";
import LanePG from "./lane";
import type LaneRepository from "../domain/lane/repository.ts";
import type {GoogleGenAI} from "@google/genai";
import type LLMRepository from "../domain/llm/repository.ts";
import Gemini from "./llm";
import type ResourceRepository from "../domain/resource/repository.ts";
import SegmentPG from "./resource";
import type {ProgressWebsocketRepository} from "../domain/websocket/repository.ts";
import {ProgressWebsocket} from "./websocket";
import ProgressPG from "./progress";
import type ProgressRepository from "../domain/progress/repository.ts";
import type MilestoneRepository from "../domain/milestone/repository.ts";
import MilestonePG from "./milestone";

export type AdapterParameters = {
    postgresClient: SQL
    redisClient: Redis
    geminiClient: GoogleGenAI
    appSecrets: AppSecrets
}

export default class Adapters {
    parameters: AdapterParameters
    userRepository: UserRepository
    laneRepository: LaneRepository
    queueRepository: QueueRepository
    youtubeRepository: YoutubeRepository
    llmRepository: LLMRepository
    resourceRepository: ResourceRepository
    progressRepository: ProgressRepository
    progressWebsocketRepository: ProgressWebsocketRepository
    milestoneRepository: MilestoneRepository

    constructor(parameters: AdapterParameters) {
        this.parameters = parameters
        this.userRepository = new UserRepositoryPG(parameters.postgresClient)
        this.laneRepository = new LanePG(parameters.postgresClient)
        this.queueRepository = new BullMQ(parameters.redisClient)
        this.youtubeRepository = new Youtube(parameters.appSecrets.googleAPIKey, parameters.appSecrets.baseYoutubeApiUrl)
        this.llmRepository = new Gemini(parameters.geminiClient, parameters.appSecrets)
        this.resourceRepository = new SegmentPG(parameters.postgresClient)
        this.progressRepository = new ProgressPG(parameters.postgresClient)
        this.progressWebsocketRepository = new ProgressWebsocket()
        this.milestoneRepository = new MilestonePG(parameters.postgresClient)
    }
}