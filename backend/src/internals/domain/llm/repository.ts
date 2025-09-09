import type {Message} from "./index.ts";

export default interface LLMRepository {
    getText: (messages: Message[]) => Promise<string>
}