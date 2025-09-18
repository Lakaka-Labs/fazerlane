import type {Message} from "./index.ts";

export default interface LLMRepository {
    getText: (messages: Message[]) => Promise<string>
    upload: (path: string, mimeType: string) => Promise<{ uri: string, mimeType: string }>
}