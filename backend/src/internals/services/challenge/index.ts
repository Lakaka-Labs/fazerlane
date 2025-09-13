import type LaneRepository from "../../domain/lane/repository.ts";
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";
import GenerateChallenges from "./commands/generateChallenges.ts";
import type ProgressRepository from "../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../domain/websocket/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type MilestoneRepository from "../../domain/milestone/repository.ts";
import type {ChallengeMemoriesRepository, UserMemoriesRepository} from "../../domain/memories/repository.ts";

export class Commands {
    segmentLaneResources: GenerateChallenges

    constructor(
        laneRepository: LaneRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        milestoneRepository: MilestoneRepository,
        challengeMemoriesRepository: ChallengeMemoriesRepository,
        userMemoriesRepository: UserMemoriesRepository
    ) {
        this.segmentLaneResources = new GenerateChallenges(
            laneRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            challengeRepository,
            milestoneRepository,
            challengeMemoriesRepository,
            userMemoriesRepository
        )
    }

}

export class Queries {
    constructor(laneRepository: LaneRepository) {
    }
}

export default class ChallengeService {
    commands: Commands
    queries: Queries

    constructor(
        laneRepository: LaneRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        milestoneRepository: MilestoneRepository,
        challengeMemoriesRepository: ChallengeMemoriesRepository,
        userMemoriesRepository: UserMemoriesRepository
    ) {
        this.commands = new Commands(
            laneRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            challengeRepository,
            milestoneRepository,
            challengeMemoriesRepository,
            userMemoriesRepository
        )
        this.queries = new Queries(laneRepository)
    }
}