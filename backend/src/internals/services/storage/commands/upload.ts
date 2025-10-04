import type {StorageRepository} from "../../../domain/storage/repository.ts";
import type LLMRepository from "../../../domain/llm/repository.ts";
import type {ObjectRepository} from "../../../domain/objects/repository.ts";
import type {FileParameter, StorageObject} from "../../../domain/objects";

export default class AddLane {
    storageRepository: StorageRepository
    llmRepository: LLMRepository
    objectRepository: ObjectRepository

    constructor(storageRepository: StorageRepository, llmRepository: LLMRepository, objectRepository: ObjectRepository) {
        this.storageRepository = storageRepository
        this.llmRepository = llmRepository
        this.objectRepository = objectRepository
    }

    async handle(files: FileParameter[], userId: string): Promise<string[]> {
        let storageObjects: Omit<StorageObject, 'id' | 'createdAt' | 'lastAccessed'>[] = []

        for (const file of files) {
            const {uri: llmUrl} = await this.llmRepository.upload(file.path, file.mimeType);
            const isActive = await this.waitForFileActive(llmUrl);
            if (!isActive) {
                throw new Error(`Failed to upload`);
            }
            const publicUrl = await this.storageRepository.upload(file)
            storageObjects.push({llmUrl, publicUrl, mimeType: file.mimeType, userId})
        }
        return await this.objectRepository.add(storageObjects)
    }

    async waitForFileActive(fileUri: string, maxWaitTime: number = 30000): Promise<boolean> {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const file = await this.llmRepository.getFile(fileUri);
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