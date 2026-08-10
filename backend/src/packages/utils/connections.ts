import {SQL} from "bun";
import type {PostgresCredentials, RedisCredentials, StorageCredentials} from "../secret";
import Redis from "ioredis";
import {GoogleGenAI} from '@google/genai';
import {S3Client} from "@aws-sdk/client-s3";

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
        maxRetriesPerRequest: credentials.maxRetriesPerRequest,
        tls: {
            servername: credentials.host, // SNI — most managed providers need this
        },
    });
};

export const googleGeminiClient = (geminiAPIKey: string) => {
    return new GoogleGenAI({apiKey: geminiAPIKey});
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