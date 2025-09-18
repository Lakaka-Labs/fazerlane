import type ChallengeRepository from "../../../domain/challenge/repository.ts";
import {BadRequestError, NotFoundError} from "../../../../packages/errors";

export default class MarkChallenge {
    challengeRepository: ChallengeRepository

    constructor(
        challengeRepository: ChallengeRepository
    ) {
        this.challengeRepository = challengeRepository
    }

    async handle(id: string, userId: string): Promise<void> {
        const challenge = await this.challengeRepository.getChallengeDetails(id);
        const challengeOrder = await this.challengeRepository.getChallengeOrder(challenge.lane);
        const currentChallengeIndex = challengeOrder.findIndex(c => c.id === id);
        if (currentChallengeIndex === -1) {
            throw new NotFoundError(`challenge not found in lane`);
        }

        const completedChallenges = await this.challengeRepository.getCompletedChallenges(challenge.lane, userId);
        const completedChallengeSet = new Set(completedChallenges);
        if (completedChallengeSet.has(id)) {
            return;
        }

        if (currentChallengeIndex === 0) {
            await this.mark(id, userId);
            return;
        }

        for (let i = 0; i < currentChallengeIndex; i++) {
            const previousChallengeId = challengeOrder[i]?.id;
            if (!completedChallengeSet.has(<string>previousChallengeId)) {
                throw new BadRequestError(
                    `'${challengeOrder[i]?.title}' must be completed first.`
                );
            }
        }

        await this.mark(id, userId);
    }

    async mark(id: string, userId: string): Promise<void> {
        await this.challengeRepository.markChallenge(id, userId);
    }
}