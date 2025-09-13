export interface ChallengeMemoriesRepository {
    add: (message: string, laneId: string) => Promise<void>
    search: (search: string,laneId: string) => Promise<string[]>
}

export interface UserMemoriesRepository {
    add: (message: string, userId: string) => Promise<void>
    search: (search: string,userId: string) => Promise<string[]>
}