import type {Challenge, Attempt, ChallengeFilter} from "./";
import type BaseFilter from "../../../packages/types/filter";

export default interface ChallengeRepository {
    add: (laneId: string, challenges: Omit<Challenge, "id" | "lane">[]) => Promise<void>
    remove: (laneId: string) => Promise<void>
    get: (laneId: string, userId?: string, filter?: ChallengeFilter) => Promise<Challenge[]>
    getSimilar: (
        embedding: number[],
        lane: string,
        userId?: string,
        threshold?: number,
        limit?: number,
    ) => Promise<Challenge[]>

    getById: (id: string) => Promise<Challenge>
    getByPosition: (laneId: string, position: number) => Promise<Challenge | null>
    getChallengeOrder: (laneId: string) => Promise<{ id: string, position: number, title: string }[]>
    unmarkChallenges: (id: string[], user_id: string) => Promise<void>
    getCompletedChallenges: (laneId: string, user_id: string) => Promise<string[]>
    addAttempt: (feedback: Omit<Attempt, 'id' | 'createdAt'>) => Promise<void>
    getAttempts: (id: string, userId: string, filter?: BaseFilter) => Promise<Attempt[]>
    getFullAttempts: (id: string, userId: string, filter?: BaseFilter) => Promise<Attempt[]>
    getTotalAttemptCount: (id: string, userId: string) => Promise<number>
}