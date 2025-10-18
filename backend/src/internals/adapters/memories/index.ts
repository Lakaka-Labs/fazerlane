import type {MemoriesRepository} from "../../domain/memories/repository.ts";
import type {Memory} from "mem0ai/oss";

export default class MemoriesMem0 implements MemoriesRepository {
    mem0Client: Memory

    constructor(mem0Client: Memory) {
        this.mem0Client = mem0Client
    }

    add = async (message: string, laneId: string): Promise<void> => {
       let a = await this.mem0Client.add(message, {userId: laneId})
    };

    search = async (search: string, laneId: string): Promise<string[]> => {
        const searchResult = await this.mem0Client.search(search, {userId: laneId})
        return searchResult.results.map((res) => res.memory)
    };

}