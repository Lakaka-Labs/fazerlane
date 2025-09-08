import ExpressHTTP from "./http";
import AppSecrets from "../../packages/secret";
import Services from "../services";
import BullMQueue from "./queue";
import type Adapters from "../adapters";

export default class Ports {
    httpPort: ExpressHTTP
    queuePort: BullMQueue

    constructor(applicationSecret: AppSecrets, services: Services, adapters: Adapters) {
        this.httpPort = new ExpressHTTP(applicationSecret, services)
        this.queuePort = new BullMQueue(applicationSecret, services, adapters.parameters.redisClient)
    }
}