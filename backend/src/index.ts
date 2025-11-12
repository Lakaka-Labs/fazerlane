import AppSecrets from "./packages/secret";
import Ports from "./internals/port";
import Adapters from "./internals/adapters";
import {
  bunPostgresClientConnection,
  ioRedisClient,
  googleGeminiClient,
  mem0ChatMemory,
  s3Client,
  mem0AttemptMemory,
} from "./packages/utils/connections.ts";
import Services from "./internals/services";
// import type {ModelResponse} from "./internals/domain/llm";

class FazerlaneBackend {
  adapters: Adapters;
  services: Services;
  port: Ports;

  constructor() {
    const appSecrets = new AppSecrets();
    const postgresClient = bunPostgresClientConnection(
      appSecrets.postgresCredentials
    );
    const redisClient = ioRedisClient(appSecrets.redisCredentials);
    const geminiClient = googleGeminiClient(
      appSecrets.geminiConfiguration.apiKey
    );
    const mem0ChatClient = mem0ChatMemory(appSecrets.openaiAPIKey);
    const mem0AttemptClient = mem0AttemptMemory(appSecrets.openaiAPIKey);
    const storageClient = s3Client(appSecrets.storageCredentials);

    this.adapters = new Adapters({
      appSecrets,
      postgresClient,
      redisClient,
      geminiClient,
      mem0ChatClient,
      mem0AttemptClient,
      storageClient,
    });

    this.services = new Services(this.adapters);
    this.port = new Ports(appSecrets, this.services, this.adapters);
  }

  run() {
    this.port.httpPort.listen();
  }
}

const fazerlaneBackend = new FazerlaneBackend();
fazerlaneBackend.run();
