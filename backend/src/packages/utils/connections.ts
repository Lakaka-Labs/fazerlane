import {SQL} from "bun";
import type {PostgresCredentials, RedisCredentials, StorageCredentials} from "../secret";
import Redis from "ioredis";
import {GoogleGenAI} from '@google/genai';
import {Memory} from "mem0ai/oss";
import {S3Client} from "@aws-sdk/client-s3";
import FeedbackFactPrompt from "../prompts/feedbackFact.ts";

export const bunPostgresClientConnection = (credentials: PostgresCredentials) => {
    return new SQL({
        host: credentials.host,
        port: credentials.port,
        database: credentials.db,
        username: credentials.user,
        password: credentials.password,
        ssl: credentials.ssl,

        onconnect: client => {
        },
        onclose: client => {
        },
    });
}

export const ioRedisClient = (credentials: RedisCredentials) => {
    return new Redis({
        host: credentials.host,
        port: credentials.port,
        username: credentials.user,
        password: credentials.password,
        maxRetriesPerRequest: credentials.maxRetriesPerRequest
    });
}

export const googleGeminiClient = (geminiAPIKey: string) => {
    return new GoogleGenAI({apiKey: geminiAPIKey});
}

export const mem0AttemptMemory = (openaiAPIKey: string) => {
    return new Memory({
        llm: {
            provider: 'openai',
            config: {
                apiKey: openaiAPIKey,
                model: 'gpt-5-nano',
            },
        },
        embedder: {
            provider: 'openai',
            config: {
                apiKey: openaiAPIKey,
                model: 'text-embedding-3-large',
            },
        },
        vectorStore: {
            provider: "qdrant",
            config: {
                collectionName: 'attempt_memories',
                dimension: 3072,
                host: 'localhost',
                port: 6333,
            },
        },
        customPrompt: FeedbackFactPrompt
    });
}

export const mem0ChatMemory = (openaiAPIKey: string) => {
    return new Memory({
        llm: {
            provider: 'openai',
            config: {
                apiKey: openaiAPIKey,
                model: 'gpt-5-nano',
            },
        },
        embedder: {
            provider: 'openai',
            config: {
                apiKey: openaiAPIKey,
                model: 'text-embedding-3-large',
            },
        },
        vectorStore: {
            provider: "qdrant",
            config: {
                collectionName: 'memories',
                dimension: 3072,
                host: 'localhost',
                port: 6333,
            },
        },
    });
}

export const s3Client = (credentials: StorageCredentials): S3Client => {
    return new S3Client({
        region: 'auto',
        endpoint: `https://${credentials.storageAccountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: credentials.storageAccessKeyId,
            secretAccessKey: credentials.storageSecretAccessKey,
        },
    });
}