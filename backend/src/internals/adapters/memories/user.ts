import type {UserMemoriesRepository} from "../../domain/memories/repository.ts";
import type {Memory, MemoryItem, SearchResult} from "mem0ai/oss";

export default class UserMemoriesMem0 implements UserMemoriesRepository {
    mem0UserClient: Memory

    constructor(mem0ChallengClient: Memory) {
        this.mem0UserClient = mem0ChallengClient
    }

    add = async (message: string, laneId: string): Promise<void> => {
        await this.mem0UserClient.add(message, {userId: laneId})
    };

    search = async (search: string, laneId: string): Promise<string[]> => {
        const searchResult = await this.mem0UserClient.search(search, {userId: laneId})
        return searchResult.results.map((res) => res.memory)
    };

}