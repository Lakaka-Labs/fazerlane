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
import GetLaneByID from "./queries/getLaneByID.ts";
import RemoveLane from "./commands/removeLane.ts";
import GetFeaturedLanes from "./queries/getFeaturedLanes.ts";
import type ChallengeRepository from "../../domain/challenge/repository.ts";

export class Commands {
    createLane: CreateLane
    redoLane: RedoLane
    addLane: AddLane
    removeLane: RemoveLane

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, progressRepository: ProgressRepository, appSecrets: AppSecrets,challengeRepository: ChallengeRepository) {
        this.createLane = new CreateLane(laneRepository, queueRepository, youtubeRepository, resourceRepository, appSecrets)
        this.redoLane = new RedoLane(laneRepository, queueRepository, progressRepository, challengeRepository)
        this.addLane = new AddLane(laneRepository)
        this.removeLane = new RemoveLane(laneRepository)
    }
}

export class Queries {
    getLaneProgress: GetLaneProgress
    getLanes: GetLanes
    getFeaturedLanes: GetFeaturedLanes
    getLaneByID: GetLaneByID

    constructor(progressRepository: ProgressRepository,laneRepository: LaneRepository) {
        this.getLaneProgress = new GetLaneProgress(progressRepository)
        this.getLanes = new GetLanes(laneRepository)
        this.getFeaturedLanes = new GetFeaturedLanes(laneRepository)
        this.getLaneByID = new GetLaneByID(laneRepository)

    }
}

export default class LaneService {
    commands: Commands
    queries: Queries

    constructor(laneRepository: LaneRepository, queueRepository: QueueRepository, youtubeRepository: YoutubeRepository, resourceRepository: ResourceRepository, progressRepository: ProgressRepository, appSecrets: AppSecrets,challengeRepository: ChallengeRepository) {
        this.commands = new Commands(laneRepository, queueRepository, youtubeRepository, resourceRepository, progressRepository, appSecrets,challengeRepository)
        this.queries = new Queries(progressRepository,laneRepository)
    }
}