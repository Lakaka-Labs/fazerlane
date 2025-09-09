import type {Lane, LaneFilter} from "./index.ts";
import type {Youtube} from "../resource";

export default interface LaneRepository {
    create: (lane: Omit<Lane, "createdAt" | "updatedAt" | "id" | "state">) => Promise<string>
    update: (id: string, lane: Partial<Omit<Lane, "createdAt" | "updatedAt" | "id" | "creator">>) => Promise<void>
    getById: (id: string) => Promise<Lane>
    getMany: (filter: LaneFilter) => Promise<Lane[]>
}