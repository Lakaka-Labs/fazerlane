import AuthenticationService from "./authentication";
import Adapters from "../adapters";
import LaneService from "./lane";

export default class Services {
    authenticationService : AuthenticationService
    laneService : LaneService

    constructor(adapters: Adapters) {
        this.authenticationService = new AuthenticationService(adapters.userRepository)
        this.laneService = new LaneService(adapters.laneRepository,adapters.queueRepository,adapters.youtubeRepository,adapters.parameters.appSecrets)
    }
}