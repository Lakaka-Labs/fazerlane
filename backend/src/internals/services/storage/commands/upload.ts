import type {StorageRepository} from "../../../domain/storage/repository.ts";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {ObjectRepository} from "../../../domain/objects/repository.ts";
import type {FileParameter, StorageObject} from "../../../domain/objects";
import type Repository from "../../../domain/user/repository.ts";
import {llmForUser} from "../../../adapters/llm/resolve.ts";
import type AppSecrets from "../../../../packages/secret";

export default class AddLane {
    storageRepository: StorageRepository
    llmRepository: LLMRepository
    objectRepository: ObjectRepository

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository, objectRepository: ObjectRepository, private readonly userRepository: Repository, private readonly appSecrets: AppSecrets) {
        this.storageRepository = storageRepository
        this.llmRepository = llmRepository
        this.objectRepository = objectRepository
    }

    async handle(files: FileParameter[], userId: string): Promise<string[]> {
        let storageObjects: Omit<StorageObject, 'id' | 'createdAt' | 'lastAccessed'>[] = []
        let user = await this.userRepository.get({id: userId})
        const llm = llmForUser(user.apiKey, this.appSecrets, this.llmRepository)

        for (const file of files) {
            const {uri: llmUrl} = await llm.upload(file.path, file.mimeType);
            const isActive = await this.waitForFileActive(llm, llmUrl);
            if (!isActive) {
                throw new Error(`Failed to upload`);
            }
            const publicUrl = await this.storageRepository.upload(file)
            storageObjects.push({llmUrl, publicUrl, mimeType: file.mimeType, userId})
        }
        return await this.objectRepository.add(storageObjects)
    }

    async waitForFileActive(llm: LLMRepository, fileUri: string, maxWaitTime: number = 30000): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const file = await llm.getFile(fileUri);
                if (file.state === 'ACTIVE') {
                    return true;
                }
                if (file.state === 'FAILED') {
                    throw new Error(`File processing failed`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error checking file state:', error);
                return false;
            }
        }
        return false;
    }

}