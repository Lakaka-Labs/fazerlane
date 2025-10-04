import type {StorageObject} from "./index.ts";

export interface ObjectRepository {
    add: (objects: Omit<StorageObject, 'lastAccessed' | 'createdAt' | 'id'>[]) => Promise<string[]>
    get: (ids: string[]) => Promise<StorageObject[]>
}