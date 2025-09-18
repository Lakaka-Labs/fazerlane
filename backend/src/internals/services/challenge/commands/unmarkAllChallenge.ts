import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {BadRequestError, NotFoundError} from "../../../../packages/errors";

export default class UnmarkAllChallenge {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(laneId: string, userId: string): Promise<void> {
        const completedChallenges = await this.challengeRepository.getCompletedChallenges(laneId, userId);

        if (completedChallenges.length === 0) {
            return;
        }

        await this.challengeRepository.unmarkChallenges(completedChallenges, userId);
    }
}