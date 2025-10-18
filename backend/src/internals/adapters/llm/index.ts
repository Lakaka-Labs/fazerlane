import type LLMRepository from "../../domain/llm/repository.ts";
import type {Message, MessagesWithRole, ModelResponse} from "../../domain/llm";
import {type Content, createPartFromUri, type GoogleGenAI, type Part} from "@google/genai";
import type AppSecrets from "../../../packages/secret";
import {ApiError} from "../../../packages/errors";

export default class Gemini implements LLMRepository {
    ai: GoogleGenAI
    appSecrets: AppSecrets

    constructor(ai: GoogleGenAI, appSecrets: AppSecrets) {
        this.ai = ai
        this.appSecrets = appSecrets
    }

    async generateEmbedding(text: string[], maxRetries = 3): Promise<{ embedding: number[] }[]> {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await this.ai.models.embedContent({
                    model: 'gemini-embedding-001',
                    contents: text,
                    config: {
                        outputDimensionality: 768
                    }
                });

                if (!response.embeddings) throw new Error("failed to embed");

                return response.embeddings.map((e) => {
                    if (!e.values) throw new Error("failed to embed text");
                    return {embedding: e.values};
                });
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (attempt < maxRetries - 1) {
                    const delayMs = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }

        throw new Error(`Failed after ${maxRetries} attempts: ${lastError?.message}`);
    }

    getText = async (messages: Message[]): Promise<ModelResponse> => {
        const chat = this.ai.chats.create({
            model: this.appSecrets.geminiConfiguration.model,
            config: {
                thinkingConfig: {
                    thinkingBudget: -1,
                }
            }
        });
        const parts: Part[] = this.getPartsFromMessage(messages)
        const response = await chat.sendMessage({
            message: parts
        });
        if (!response.text) throw new ApiError("could not generate response")
        // console.log({
        //     promptTokenCount: response.usageMetadata?.promptTokenCount,
        //     thoughtsTokenCount: response.usageMetadata?.thoughtsTokenCount,
        //     candidatesTokenCount: response.usageMetadata?.candidatesTokenCount,
        //     totalTokenCount: response.usageMetadata?.totalTokenCount,
        //     cachedContentTokenCount: response.usageMetadata?.cachedContentTokenCount
        // })
        const outputTokens = (response.usageMetadata?.totalTokenCount || 0) -
            (response.usageMetadata?.promptTokenCount  || 0)

        return {response: response.text, tokenCount: outputTokens}
    }

    async* getTextStream(
        messages: MessagesWithRole[],
        signal?: AbortSignal
    ): AsyncGenerator<ModelResponse> {
        const contents: Content[] = messages.map(({role, messages}) => {
            return {role, parts: this.getPartsFromMessage(messages)}
        });

        const response = await this.ai.models.generateContentStream({
            model: this.appSecrets.geminiConfiguration.model,
            config: {
                abortSignal: signal,
                thinkingConfig: {
                    thinkingBudget: -1,
                }
            },
            contents: contents,
        });

        for await (const chunk of response) {
            // Check if aborted before yielding
            if (signal?.aborted) {
                break;
            }
            const outputTokens = (chunk.usageMetadata?.totalTokenCount || 0) -
                (chunk.usageMetadata?.promptTokenCount  || 0)

            yield {
                response: chunk.text || "",
                tokenCount: outputTokens
            }
        }
    }

    getTokens = async (messages: MessagesWithRole[] | Message[]): Promise<number> => {
        if (!messages[0]) return 0
        let contents: Part[] | Content[];

        if (messages.length > 0 && 'role' in messages[0]) {
            contents = (messages as MessagesWithRole[]).map(({role, messages: msgs}) => {
                return {role, parts: this.getPartsFromMessage(msgs)}
            });
        } else {
            contents = this.getPartsFromMessage(messages as Message[]);
        }

        const response = await this.ai.models.countTokens({
            model: this.appSecrets.geminiConfiguration.model,
            contents,
        });

        return response.totalTokens || 0;
    }
    upload = async (path: string, mimeType: string): Promise<{ uri: string; mimeType: string; name: string; }> => {
        const file = await this.ai.files.upload({
            file: path,
            config: {mimeType: mimeType},

        });
        if (!file.uri || !file.mimeType || !file.name) {
            throw new Error("failed to analyse content")
        }
        return {uri: file.uri, mimeType: file.mimeType, name: file.name}
    };

    getFile = async (name: string): Promise<{ state: string; }> => {
        const file = await this.ai.files.get({
            name: name,
        });
        if (!file.state) {
            throw new Error("failed to analyse content")
        }
        return {state: file.state}
    };

    getPartsFromMessage = (messages: Message[]): Part[] => {
        return messages.map(({text, data, uploadedData}) => {
            if (uploadedData) {
                return createPartFromUri(uploadedData.uri, uploadedData.mimeType)
            } else {
                return {
                    text,
                    fileData: data ? {fileUri: data.fileUri} : undefined,
                    videoMetadata: data
                        ? {
                            ...(data.endOffset && {endOffset: `${data.endOffset}s`}),
                            ...(data.startOffset && {startOffset: `${data.startOffset}s`}),
                            ...(data.fps && {fps: data.fps}),
                        }
                        : undefined,
                }
            }
        });
    }

}