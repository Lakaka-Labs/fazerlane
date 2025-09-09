import type LaneRepository from "../../domain/lane/repository.ts";
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";
import SegmentLaneResources from "./commands/segmentLaneResources.ts";
import type ProgressRepository from "../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../domain/websocket/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";

export class Commands {
    segmentLaneResources: SegmentLaneResources

    constructor(
        laneRepository: LaneRepository,
        queueRepository: QueueRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
    ) {
        this.segmentLaneResources = new SegmentLaneResources(
            laneRepository,
            queueRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
        )
    }

}

export class Queries {
    constructor(laneRepository: LaneRepository) {
    }
}

export default class ResourceService {
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
    ) {
        this.commands = new Commands(laneRepository,
            queueRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
        )
        this.queries = new Queries(laneRepository)
    }
}