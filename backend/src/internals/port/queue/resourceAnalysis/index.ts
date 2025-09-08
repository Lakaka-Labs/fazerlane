import {Job} from "bullmq";

export default class ResourceAnalysis {
    constructor() {
    }

    handler = (job: Job) => {
        console.log({jobData: job.data, id: job.id, name: "ra"})
    }
}