import Upload from "./commands/upload.ts";
import type {StorageRepository} from "../../domain/storage/repository.ts";
import type LLMRepository from "../../domain/llm/repository.ts";
import type {ObjectRepository} from "../../domain/objects/repository.ts";

export class Commands {
    upload: Upload

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository,objectRepository: ObjectRepository) {
        this.upload = new Upload(storageRepository, llmRepository,objectRepository)
    }
}

export default class StorageService {
    commands: Commands

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository, objectRepository: ObjectRepository) {
        this.commands = new Commands(storageRepository,llmRepository,objectRepository)
    }
}
