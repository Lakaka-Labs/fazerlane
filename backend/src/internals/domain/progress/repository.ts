import type {BaseProgress, Progress} from "./index.ts";

export default interface ProgressRepository {
    add : (progress: BaseProgress) => Promise<void>
    get : (laneId: string) => Promise<Progress[]>
}