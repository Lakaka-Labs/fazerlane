import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {BadRequestError, NotFoundError} from "../../../../packages/errors";

export default class UnmarkChallenge {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(id: string, userId: string): Promise<void> {
        await this.challengeRepository.unmarkChallenges([id], userId);
    }
}