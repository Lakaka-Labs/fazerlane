import type {Challenge} from "./";

export default interface ChallengeRepository {
    add: (laneId: string, challenges: Omit<Challenge, "id" | "lane">[]) => Promise<void>
    get: (laneId: string) => Promise<Challenge[]>
    getChallengeDetails: (id: string) => Promise<Challenge>
    getChallengeOrder: (laneId: string) => Promise<{ id: string, position: number,title: string }[]>
    markChallenge: (id: string, user_id: string) => Promise<void>
    unmarkChallenges: (id: string[], user_id: string) => Promise<void>
    getCompletedChallenges: (laneId: string, user_id: string) => Promise<string[]>
}