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
import type {Memory} from "mem0ai/oss";
import type ChallengeRepository from "../domain/challenge/repository.ts";
import ChallengePG from "./challenge";
import type {UserMemoriesRepository} from "../domain/memories/repository.ts";
import UserMemoriesMem0 from "./memories/user.ts";
import SMTPClass from "./email/smtp.ts";
import type {EmailRepository} from "../domain/email/repository.ts";
import type XPRepository from "../domain/xp/repository.ts";
import XPPG from "./xp";
import type {S3Client} from "@aws-sdk/client-s3";
import type {StorageRepository} from "../domain/storage/repository.ts";
import {S3StorageClass} from "./storage/s3.ts";
import type {ObjectRepository} from "../domain/objects/repository.ts";
import ObjectPG from "./object";

export type AdapterParameters = {
    postgresClient: SQL
    redisClient: Redis
    geminiClient: GoogleGenAI
    appSecrets: AppSecrets
    mem0UserClient: Memory
    storageClient: S3Client
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
    challengeRepository: ChallengeRepository
    userMemoriesRepository: UserMemoriesRepository
    emailRepository: EmailRepository
    xpRepository: XPRepository
    storageRepository: StorageRepository
    objectRepository: ObjectRepository

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
        this.challengeRepository = new ChallengePG(parameters.postgresClient)
        this.userMemoriesRepository = new UserMemoriesMem0(parameters.mem0UserClient)
        this.emailRepository = new SMTPClass(parameters.appSecrets.smtpCredential)
        this.xpRepository = new XPPG(parameters.postgresClient, parameters.appSecrets.xpPoints)
        this.storageRepository = new S3StorageClass(parameters.storageClient, parameters.appSecrets.storageCredentials)
        this.objectRepository= new ObjectPG(parameters.postgresClient)
    }
}