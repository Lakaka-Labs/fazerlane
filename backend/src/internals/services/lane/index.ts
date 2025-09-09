import type Repository from "../../domain/user/repository.ts";
import type LaneRepository from "../../domain/lane/repository.ts";
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import type YoutubeRepository from "../../domain/youtube/repository.ts";
import CreateLane from "./commands/createLane.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";

export class Commands {
    createLane: CreateLane

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, appSecrets: AppSecrets) {
        this.createLane = new CreateLane(laneRepository, queueRepository, youtubeRepository, resourceRepository, appSecrets)
    }

}

export class Queries {
    constructor(laneRepository: LaneRepository) {
    }
}

export default class LaneService {
    commands: Commands
    queries: Queries

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, appSecrets: AppSecrets) {
        this.commands = new Commands(laneRepository, queueRepository, youtubeRepository, resourceRepository, appSecrets)
        this.queries = new Queries(laneRepository)
    }
}