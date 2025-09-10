import {Job} from "bullmq";
import type MilestoneService from "../../../services/milestone";

export default class milestoneGeneration {
    milestoneService: MilestoneService

    constructor(milestoneService: MilestoneService) {
        this.milestoneService = milestoneService
    }

    handler = async (job: Job) => {
        const {laneId} = job.data
        await this.milestoneService.commands.generateMilestone.handle(laneId, job.attemptsMade + 1, job.opts.attempts || 0)
    }
}