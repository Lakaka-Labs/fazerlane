import type LLMRepository from "../../domain/llm/repository.ts";
import type {Message} from "../../domain/llm";
import type {GoogleGenAI, Part} from "@google/genai";
import type AppSecrets from "../../../packages/secret";
import {text} from "express";
import {ApiError} from "../../../packages/errors";

export default class Gemini implements LLMRepository {
    ai: GoogleGenAI
    appSecrets: AppSecrets

    constructor(ai: GoogleGenAI, appSecrets: AppSecrets) {
        this.ai = ai
        this.appSecrets = appSecrets
    }

    getText = async (messages: Message[]): Promise<string> => {
        const chat = this.ai.chats.create({
            model: this.appSecrets.geminiConfiguration.model,
            config: {
                thinkingConfig: {
                    thinkingBudget: -1,
                }
            }
        });
        const parts: Part[] = messages.map(({text, data}) => ({
            text,
            fileData: data ? {fileUri: data.fileUri} : undefined,
            videoMetadata: data
                ? {
                    ...(data.endOffset && {endOffset: `${data.endOffset}s`}),
                    ...(data.startOffset && {startOffset: `${data.startOffset}s`}),
                    ...(data.fps && {fps: data.fps}),
                }
                : undefined,
        }));
        const response = await chat.sendMessage({
            message: parts
        });
        if (!response.text) throw new ApiError("could not generate response")
        return response.text
    }
}