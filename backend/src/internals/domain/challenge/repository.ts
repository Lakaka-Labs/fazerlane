import type {Challenge} from "./";

export default interface ChallengeRepository {
    add : (milestoneId:string,challenges: Omit<Challenge, "id" | "milestone">[]) => Promise<void>
    get : (milestoneId: string) => Promise<Challenge[]>
}