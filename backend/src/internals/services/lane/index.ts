import type Repository from "../../domain/user/repository.ts";
import type LaneRepository from "../../domain/lane/repository.ts";
import type QueueRepository from "../../domain/queue/queueRepository.ts";
import type YoutubeRepository from "../../domain/youtube/repository.ts";
import CreateLane from "./commands/createLane.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";
import RedoLane from "./commands/redoLane.ts";
import type ProgressRepository from "../../domain/progress/repository.ts";
import GetLaneProgress from "./queries/getLaneProgress.ts";
import GetLanes from "./queries/getLanes.ts";
import AddLane from "./commands/addLane.ts";

export class Commands {
    createLane: CreateLane
    redoLane: RedoLane
    addLane: AddLane

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, progressRepository: ProgressRepository, appSecrets: AppSecrets) {
        this.createLane = new CreateLane(laneRepository, queueRepository, youtubeRepository, resourceRepository, appSecrets)
        this.redoLane = new RedoLane(laneRepository, queueRepository, youtubeRepository, resourceRepository, progressRepository, appSecrets)
        this.addLane = new AddLane(laneRepository)
    }
}

export class Queries {
    getLaneProgress: GetLaneProgress
    getLanes: GetLanes

    constructor(progressRepository: ProgressRepository,laneRepository: LaneRepository) {
        this.getLaneProgress = new GetLaneProgress(progressRepository)
        this.getLanes = new GetLanes(laneRepository)

    }
}

export default class LaneService {
    commands: Commands
    queries: Queries

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, progressRepository: ProgressRepository, appSecrets: AppSecrets) {
        this.commands = new Commands(laneRepository, queueRepository, youtubeRepository, resourceRepository, progressRepository, appSecrets)
        this.queries = new Queries(progressRepository,laneRepository)
    }
}