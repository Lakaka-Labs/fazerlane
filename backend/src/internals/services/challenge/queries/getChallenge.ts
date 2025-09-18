import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import type {Challenge} from "../../../domain/challenge";

export default class GetChallenge {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(laneId: string, userId?: string): Promise<Challenge[]> {
        const challenges = await this.challengeRepository.get(laneId);

        if (!userId) {
            return challenges.map(challenge => ({
                ...challenge,
                isCompleted: false
            }));
        }

        const completedChallenges = await this.challengeRepository.getCompletedChallenges(laneId, userId);
        const completedChallengeSet = new Set(completedChallenges);

        return challenges.map(challenge => ({
            ...challenge,
            isCompleted: completedChallengeSet.has(challenge.id)
        }));
    }
}