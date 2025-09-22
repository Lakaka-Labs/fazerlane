import type LLMRepository from "../../domain/llm/repository.ts";
import type {Message} from "../../domain/llm";
import {createPartFromUri, type GoogleGenAI, type Part} from "@google/genai";
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
        const parts: Part[] = messages.map(({text, data, uploadedData}) => {
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
        const response = await chat.sendMessage({
            message: parts
        });
        if (!response.text) throw new ApiError("could not generate response")
        return response.text
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

}