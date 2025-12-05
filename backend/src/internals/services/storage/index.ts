import Upload from "./commands/upload.ts";
import type {StorageRepository} from "../../domain/storage/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import type {ObjectRepository} from "../../domain/objects/repository.ts";
import type Repository from "../../domain/user/repository.ts";
import type AppSecrets from "../../../packages/secret";

export class Commands {
    upload: Upload

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository, objectRepository: ObjectRepository, userRepository: Repository, appSecrets: AppSecrets) {
        this.upload = new Upload(storageRepository, llmRepository, objectRepository,userRepository,appSecrets)
    }
}

export default class StorageService {
    commands: Commands

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository, objectRepository: ObjectRepository, userRepository: Repository, appSecrets: AppSecrets) {
        this.commands = new Commands(storageRepository, llmRepository, objectRepository,userRepository,appSecrets)
    }
}
