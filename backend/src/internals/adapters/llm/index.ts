import type LLMRepository from "../../domain/llm/repository.ts";
import type {Message, MessagesWithRole, ModelResponse} from "../../domain/llm";
import {type Content, createPartFromUri, type GoogleGenAI, type Part, ApiError as GenAiError} from "@google/genai";
import type AppSecrets from "../../../packages/secret";
import {AIRateLimitError, ApiError, BadRequestError} from "../../../packages/errors";

/** Gemini's wording when a File uri is expired, deleted, or owned by another key. */
const MISSING_FILE_ERROR = /permission to access the File/i;

export default class Gemini implements LLMRepository {
    ai: GoogleGenAI
    appSecrets: AppSecrets
    useUserProvidedKey: boolean

    constructor(ai: GoogleGenAI, appSecrets: AppSecrets, useUserProvidedKey: boolean = false) {
        this.ai = ai
        this.appSecrets = appSecrets
        this.useUserProvidedKey = useUserProvidedKey
    }

    private getModel = (useFastModel: boolean): string => {
        if (this.useUserProvidedKey) return this.appSecrets.geminiConfiguration.premiumModel
        return useFastModel ? this.appSecrets.geminiConfiguration.fastModel : this.appSecrets.geminiConfiguration.model
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

    getText = async (messages: Message[], useFastModel: boolean = false,): Promise<ModelResponse> => {
        try {
            const chat = this.ai.chats.create({
                model: this.getModel(useFastModel),
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
            const outputTokens = (response.usageMetadata?.totalTokenCount || 0) -
                (response.usageMetadata?.promptTokenCount || 0)

            return {response: response.text, tokenCount: outputTokens}
        } catch (e: any) {
            throw this.toApiError(e)
        }

    }

    async* getTextStream(
        messages: MessagesWithRole[],
        useFastModel: boolean = false,
        signal?: AbortSignal
    ): AsyncGenerator<ModelResponse> {
        try {
            const contents: Content[] = messages.map(({role, messages}) => {
                return {role, parts: this.getPartsFromMessage(messages)}
            });
            const response = await this.ai.models.generateContentStream({
                model: this.getModel(useFastModel),
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
                    (chunk.usageMetadata?.promptTokenCount || 0)

                yield {
                    response: chunk.text || "",
                    tokenCount: outputTokens
                }
            }
        } catch (e: any) {
            throw this.toApiError(e)
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

        try {
            const response = await this.ai.models.countTokens({
                model: this.appSecrets.geminiConfiguration.model,
                contents,
            });

            return response.totalTokens || 0;
        } catch (e: any) {
            throw this.toApiError(e)
        }
    }
    upload = async (path: string, mimeType: string): Promise<{ uri: string; mimeType: string; name: string; }> => {
        try {
            const file = await this.ai.files.upload({
                file: path,
                config: {mimeType: mimeType},

            });
            if (!file.uri || !file.mimeType || !file.name) {
                throw new ApiError("failed to analyse content")
            }
            return {uri: file.uri, mimeType: file.mimeType, name: file.name}
        } catch (e: any) {
            throw this.toApiError(e)
        }
    };

    getFile = async (name: string): Promise<{ state: string; }> => {
        try {
            const file = await this.ai.files.get({
                name: name,
            });
            if (!file.state) {
                throw new ApiError("failed to analyse content")
            }
            return {state: file.state}
        } catch (e: any) {
            throw this.toApiError(e)
        }
    };

    /**
     * The SDK puts the raw JSON response body in `error.message`, so every call
     * into Gemini has to come back out as one of our own errors — otherwise the
     * blob travels all the way to the client.
     */
    private toApiError = (e: any): Error => {
        // A cancelled submission isn't a failure and has its own stream event, so
        // the name has to survive rather than be relabelled as a model error.
        if (e?.name === 'AbortError') return e

        console.error("gemini error:", e)

        if (e instanceof ApiError) return e

        if (e.status === 429) {
            return new AIRateLimitError("You've exceeded your rate limit")
        }
        if (e.status === 403) {
            // Uploaded files live for 48h on Gemini's side while we keep their uri
            // forever, so a resubmitted old attempt reads as a permission failure.
            if (MISSING_FILE_ERROR.test(String(e.message ?? ""))) {
                return new BadRequestError(
                    "We couldn't read one of your uploaded files, re-upload it and try again"
                )
            }
            return new BadRequestError("You do not have required permissions")
        }

        return new ApiError("model overload, try again")
    }

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