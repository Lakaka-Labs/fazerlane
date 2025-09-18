import type {Challenge, Attempt} from "./";
import type BaseFilter from "../../../packages/types/filter";

export default interface ChallengeRepository {
    add: (laneId: string, challenges: Omit<Challenge, "id" | "lane">[]) => Promise<void>
    get: (laneId: string, userId?: string) => Promise<Challenge[]>
    getById: (id: string) => Promise<Challenge>
    getChallengeOrder: (laneId: string) => Promise<{ id: string, position: number, title: string }[]>
    markChallenge: (id: string, user_id: string) => Promise<void>
    unmarkChallenges: (id: string[], user_id: string) => Promise<void>
    getCompletedChallenges: (laneId: string, user_id: string) => Promise<string[]>
    addAttempt: (feedback: Omit<Attempt, 'id' | 'createdAt'>) => Promise<void>
    getAttempts: (id: string, userId: string, filter?: BaseFilter) => Promise<Attempt[]>
}