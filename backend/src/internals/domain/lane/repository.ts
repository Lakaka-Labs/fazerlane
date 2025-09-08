import type {Lane, LaneFilter, Youtube} from "./index.ts";

export default interface LaneRepository {
    create: (lane: Omit<Lane, "createdAt" | "updatedAt" | "id">, youtubes: Youtube[]) => Promise<string>
    getById: (id: string) => Promise<Lane>
    getMany: (filter: LaneFilter) => Promise<Lane[]>
}