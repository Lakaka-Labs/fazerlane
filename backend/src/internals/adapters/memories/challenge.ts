import type {ChallengeMemoriesRepository} from "../../domain/memories/repository.ts";
import type {Memory, MemoryItem, SearchResult} from "mem0ai/oss";

export default class ChallengeMemoriesMem0 implements ChallengeMemoriesRepository {
    mem0ChallengeClient: Memory

    constructor(mem0ChallengClient: Memory) {
        this.mem0ChallengeClient = mem0ChallengClient
    }

    add = async (message: string, laneId: string): Promise<void> => {
        await this.mem0ChallengeClient.add(message, {userId: laneId})
    };

    search = async (search: string, laneId: string): Promise<string[]> => {
        const searchResult = await this.mem0ChallengeClient.search(search, {userId: laneId})
        return searchResult.results.map((res) => res.memory)
    };

}