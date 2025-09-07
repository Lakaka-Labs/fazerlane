import type {QueueName} from "./index.ts";

export default interface Repository {
    addJob: (queue: QueueName, data: any) => Promise<void>
}