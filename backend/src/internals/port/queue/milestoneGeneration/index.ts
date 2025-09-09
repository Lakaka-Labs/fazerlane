import {Job} from "bullmq";

export default class milestoneGeneration {
    constructor() {
    }

    handler = async (job: Job) => {
        console.log({jobData: job.data, id: job.id, name: "pg"})
    }
}