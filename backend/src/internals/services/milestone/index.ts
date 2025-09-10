import type LaneRepository from "../../domain/lane/repository.ts";
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";
import type ProgressRepository from "../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../domain/websocket/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import GenerateMilestone from "./commands/generateMilestone.ts";
import type MilestoneRepository from "../../domain/milestone/repository.ts";

export class Commands {
    generateMilestone: GenerateMilestone

    constructor(
        laneRepository: LaneRepository,
        queueRepository: QueueRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        milestoneRepository: MilestoneRepository
    ) {
        this.generateMilestone = new GenerateMilestone(
            laneRepository,
            queueRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            milestoneRepository
        )
    }

}

export class Queries {
    constructor(laneRepository: LaneRepository) {
    }
}

export default class MilestoneService {
    commands: Commands
    queries: Queries

    constructor(
        laneRepository: LaneRepository,
        queueRepository: QueueRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        milestoneRepository: MilestoneRepository
    ) {
        this.commands = new Commands(
            laneRepository,
            queueRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            milestoneRepository
        )
        this.queries = new Queries(laneRepository)
    }
}