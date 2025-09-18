import type {Lane, LaneFilter} from "./index.ts";
import type {Youtube} from "../resource";

export default interface LaneRepository {
    create: (creator: string, youtube: string) => Promise<string>
    update: (id: string, lane: Partial<Pick<Lane, "challengeGenerated" | "state">>) => Promise<void>
    getById: (id: string) => Promise<Lane>
    getLanes: (filter: LaneFilter) => Promise<Lane[]>
    addLane: (id: string, userId: string) => Promise<void>
}