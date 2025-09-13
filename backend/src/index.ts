import AppSecrets from "./packages/secret";
import Ports from "./internals/port";
import Adapters from "./internals/adapters";
import {
    bunPostgresClientConnection,
    ioRedisClient,
    googleGeminiClient, mem0UserMemory, mem0ChallengeMemory
} from "./packages/utils/connections.ts";
import Services from "./internals/services";

class FazerlaneBackend {
    adapters: Adapters
    services: Services
    port: Ports

    constructor() {
        const appSecrets = new AppSecrets()
        const postgresClient = bunPostgresClientConnection(appSecrets.postgresCredentials)
        const redisClient = ioRedisClient(appSecrets.redisCredentials)
        const geminiClient = googleGeminiClient(appSecrets.geminiConfiguration.apiKey)
        const mem0UserClient = mem0UserMemory(appSecrets.openaiAPIKey, appSecrets.postgresCredentials)
        const mem0ChallengeClient = mem0ChallengeMemory(appSecrets.openaiAPIKey, appSecrets.postgresCredentials)

        this.adapters = new Adapters({
            appSecrets,
            postgresClient,
            redisClient,
            geminiClient,
            mem0UserClient,
            mem0ChallengeClient
        })
        this.services = new Services(this.adapters)
        this.port = new Ports(appSecrets, this.services, this.adapters)
    }

    run() {

        this.port.httpPort.listen()
    }
}

const fazerlaneBackend = new FazerlaneBackend()
fazerlaneBackend.run()