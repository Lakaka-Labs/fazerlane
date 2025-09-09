import AuthenticationService from "./authentication";
import Adapters from "../adapters";
import LaneService from "./lane";
import ResourceService from "./resource";

export default class Services {
    authenticationService: AuthenticationService
    laneService: LaneService
    resourceService: ResourceService

    constructor(adapters: Adapters) {
        this.authenticationService = new AuthenticationService(adapters.userRepository)
        this.laneService = new LaneService(
            adapters.laneRepository,
            adapters.queueRepository,
            adapters.youtubeRepository,
            adapters.resourceRepository,
            adapters.progressRepository,
            adapters.parameters.appSecrets
        )
        this.resourceService = new ResourceService(
            adapters.laneRepository,
            adapters.queueRepository,
            adapters.resourceRepository,
            adapters.parameters.appSecrets,
            adapters.progressRepository,
            adapters.progressWebsocketRepository,
            adapters.llmRepository
        )
    }
}