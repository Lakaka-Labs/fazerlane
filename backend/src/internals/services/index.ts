import AuthenticationService from "./authentication";
import Adapters from "../adapters";
import LaneService from "./lane";
import ChallengeService from "./challenge";

export default class Services {
    authenticationService: AuthenticationService
    laneService: LaneService
    challengeService: ChallengeService

    constructor(adapters: Adapters) {
        this.authenticationService = new AuthenticationService(adapters.userRepository, adapters.parameters.appSecrets, adapters.emailRepository)
        this.laneService = new LaneService(
            adapters.laneRepository,
            adapters.queueRepository,
            adapters.youtubeRepository,
            adapters.resourceRepository,
            adapters.progressRepository,
            adapters.parameters.appSecrets
        )
        this.challengeService = new ChallengeService(
            adapters.laneRepository,
            adapters.resourceRepository,
            adapters.parameters.appSecrets,
            adapters.progressRepository,
            adapters.progressWebsocketRepository,
            adapters.llmRepository,
            adapters.challengeRepository,
        )
    }
}