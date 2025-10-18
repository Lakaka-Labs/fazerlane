export interface MemoriesRepository {
    add: (message: string, userId: string) => Promise<void>
    search: (search: string,userId: string) => Promise<string[]>
}