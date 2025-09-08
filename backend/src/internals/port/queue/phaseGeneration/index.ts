import {Job} from "bullmq";

export default class PhaseGeneration {
    constructor() {
    }

    handler = (job: Job) => {
        console.log({jobData: job.data, id: job.id, name: "pg"})
    }
}