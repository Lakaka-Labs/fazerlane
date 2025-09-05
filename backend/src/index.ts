import AppSecrets from "./packages/secret";
import Ports from "./internals/port";
import Adapters from "./internals/adapters";
import {postgresClientConnection} from "./packages/utils/connections.ts";
import Services from "./internals/services";

class FazerlaneBackend {
    adapters: Adapters
    services: Services
    port: Ports

    constructor() {
        const appSecrets = new AppSecrets()
        const postgresClient = postgresClientConnection(appSecrets.postgresCredentials)


        this.adapters = new Adapters({
            appSecrets,
            postgresClient
        })
        this.services = new Services(this.adapters)
        this.port = new Ports(appSecrets, this.services)
    }

    run() {
        this.port.httpPort.listen()
    }
}

const fazerlaneBackend = new FazerlaneBackend()
fazerlaneBackend.run()