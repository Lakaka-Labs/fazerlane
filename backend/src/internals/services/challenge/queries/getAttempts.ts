import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import type {Attempt} from "../../../domain/challenge";
import type BaseFilter from "../../../../packages/types/filter";

export default class GetAttempts {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(id: string, userId: string, filter?: BaseFilter): Promise<Attempt[]> {
        return await this.challengeRepository.getAttempts(id, userId, filter);
    }
}