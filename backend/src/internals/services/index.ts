import AuthenticationService from "./authentication";
import Adapters from "../adapters";
import LaneService from "./lane";
import ChallengeService from "./challenge";
import XPService from "./xp";
import StorageService from "./storage";
import ChatService from "./chat";

export default class Services {
    authenticationService: AuthenticationService
    laneService: LaneService
    challengeService: ChallengeService
    xpService: XPService
    storageService: StorageService
    chatService: ChatService

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
            adapters.xpRepository,
            adapters.objectRepository,
            adapters.attemptMemoriesRepository
        )
        this.xpService = new XPService(
            adapters.xpRepository,
        )
        this.storageService = new StorageService(adapters.storageRepository, adapters.llmRepository, adapters.objectRepository)
        this.chatService = new ChatService(adapters.chatRepository, adapters.llmRepository, adapters.chatMemoriesRepository, adapters.challengeRepository)
    }
}