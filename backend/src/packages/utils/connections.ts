import {SQL} from "bun";
import type {PostgresCredentials, RedisCredentials} from "../secret";
import Redis from "ioredis";
import {GoogleGenAI} from '@google/genai';
import {Memory} from "mem0ai/oss";

export const bunPostgresClientConnection = (credentials: PostgresCredentials) => {
    return new SQL({
        host: credentials.host,
        port: credentials.port,
        database: credentials.db,
        username: credentials.user,
        password: credentials.password,
        tls: credentials.ssl,

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

export const mem0UserMemory = (openaiAPIKey: string, credentials: PostgresCredentials) => {
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