import type LaneRepository from "../../domain/lane/repository.ts";
import type AppSecrets from "../../../packages/secret";
import type ResourceRepository from "../../domain/resource/repository.ts";
import GenerateChallenges from "./commands/generateChallenges.ts";
import type ProgressRepository from "../../domain/progress/repository.ts";
import type {ProgressWebsocketRepository} from "../../domain/websocket/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import GetChallenge from "./queries/getChallenge.ts";
import MarkChallenge from "./commands/markChallenge.ts";
import UnmarkChallenge from "./commands/unmarkChallenge.ts";
import UnmarkAllChallenge from "./commands/unmarkAllChallenge.ts";
import GetAttempts from "./queries/getAttempts.ts";
import GetChallenges from "./queries/getChallenges.ts";
import type XPRepository from "../../domain/xp/repository.ts";

export class Commands {
    generateChallenge: GenerateChallenges
    markChallenge: MarkChallenge
    unmarkChallenge: UnmarkChallenge
    unmarkAllChallenge: UnmarkAllChallenge

    constructor(
        laneRepository: LaneRepository,
        resourceRepository: ResourceRepository,
        appSecrets: AppSecrets,
        progressRepository: ProgressRepository,
        progressWebsocketRepository: ProgressWebsocketRepository,
        llmRepository: LLMRepository,
        challengeRepository: ChallengeRepository,
        xpRepository: XPRepository
    ) {
        this.generateChallenge = new GenerateChallenges(
            laneRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            challengeRepository,
        )
        this.markChallenge = new MarkChallenge(
            challengeRepository, llmRepository, xpRepository, appSecrets
        )
        this.unmarkChallenge = new UnmarkChallenge(
            challengeRepository
        )
        this.unmarkAllChallenge = new UnmarkAllChallenge(
            challengeRepository
        )
    }

}

export class Queries {
    getChallenge: GetChallenge
    getChallenges: GetChallenges
    getAttempts: GetAttempts

    constructor(challengeRepository: ChallengeRepository) {
        this.getChallenge = new GetChallenge(challengeRepository)
        this.getChallenges = new GetChallenges(challengeRepository)
        this.getAttempts = new GetAttempts(challengeRepository)
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
        xpRepository: XPRepository
    ) {
        this.commands = new Commands(
            laneRepository,
            resourceRepository,
            appSecrets,
            progressRepository,
            progressWebsocketRepository,
            llmRepository,
            challengeRepository,
            xpRepository,
        )
        this.queries = new Queries(challengeRepository)
    }
}