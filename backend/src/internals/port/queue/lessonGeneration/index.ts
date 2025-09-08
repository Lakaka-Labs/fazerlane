import {Job} from "bullmq";

export default class LessonGeneration {
    constructor() {
    }

    handler = (job: Job) => {
        console.log({jobData: job.data, id: job.id, name: "lg"})
    }
}