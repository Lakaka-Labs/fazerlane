import type {Message, MessagesWithRole, ModelResponse} from "./index.ts";

export default interface LLMRepository {
    generateEmbedding: (text: string[]) => Promise<{ embedding: number[] }[]>
    getText: (messages: Message[]) => Promise<ModelResponse>

    getTextStream(messages: MessagesWithRole[], signal?: AbortSignal): AsyncGenerator<ModelResponse>;

    getTokens: (messages: MessagesWithRole[] | Message[]) => Promise<number>
    getFile: (name: string) => Promise<{ state: string }>
    upload: (path: string, mimeType: string) => Promise<{ uri: string, mimeType: string }>
}