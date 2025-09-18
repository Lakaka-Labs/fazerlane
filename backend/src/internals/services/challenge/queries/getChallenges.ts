import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import type {Challenge} from "../../../domain/challenge";

export default class GetChallenges {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(laneId: string, userId?: string): Promise<Challenge[]> {
        return await this.challengeRepository.get(laneId, userId);

    }
}