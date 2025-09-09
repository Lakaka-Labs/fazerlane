import {Job} from "bullmq";
import type ResourceService from "../../../services/resource";

export default class ResourceAnalysis {
    resourceService: ResourceService

    constructor(resourceService: ResourceService) {
        this.resourceService = resourceService
    }

    handler = async (job: Job) => {
        const {laneId} = job.data
        const retry = await this.resourceService.commands.segmentLaneResources.handle(laneId,job.attemptsMade + 1,job.opts.attempts || 0)
        if (retry) {
            throw new Error()
        }
    }
}