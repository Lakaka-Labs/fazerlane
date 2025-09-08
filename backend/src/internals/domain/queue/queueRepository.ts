import type {QueueName} from "./index.ts";

export default interface QueueRepository {
    addJob: (queue: QueueName, data: any) => Promise<void>
}