import {Job} from "bullmq";
import type ChallengeService from "../../../services/challenge";

export default class challengeGeneration {
    challengeService: ChallengeService

    constructor(challengeService: ChallengeService) {
        this.challengeService = challengeService
    }

    handler = async (job: Job) => {
        const {laneId} = job.data
        const retry = await this.challengeService.commands.segmentLaneResources.handle(laneId, job.attemptsMade + 1, job.opts.attempts || 0)
        if (retry) {
            throw new Error()
        }
    }
}