import type {Lane, LaneFilter} from "./index.ts";
import type {Youtube} from "../resource";
import type BaseFilter from "../../../packages/types/filter";

export default interface LaneRepository {
    create: (creator: string, youtube: string, startTime?: number, endTime?: number) => Promise<string>
    update: (id: string, lane: Partial<Pick<Lane, "challengeGenerated" | "state" | "featured">>) => Promise<void>
    getById: (id: string, userId?: string) => Promise<Lane>
    getLanes: (filter: LaneFilter) => Promise<Lane[]>
    getFeaturedLanes: (filter: LaneFilter) => Promise<Lane[]>
    addLane: (id: string, userId: string) => Promise<void>
    removeLane: (id: string, userId: string) => Promise<void>
}