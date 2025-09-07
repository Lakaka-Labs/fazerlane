import {SQL} from "bun";
import type {PostgresCredentials, RedisCredentials} from "../secret";
import Redis from "ioredis";

export const bunPostgresClientConnection = (credentials: PostgresCredentials): SQL => {
    return new SQL({
        host: credentials.host,
        port: credentials.port,
        database: credentials.db,
        username: credentials.user,
        password: credentials.password,
        tls: credentials.ssl,

        onconnect: client => {
            console.log("Connected to PostgreSQL");
        },
        onclose: client => {
            console.log("PostgreSQL connection closed");
        },
    });
}

export const ioRedisClient = (credentials: RedisCredentials): Redis => {
    return new Redis({
        host: credentials.host,
        port: credentials.port,
        username: credentials.user,
        password: credentials.password,
        maxRetriesPerRequest: credentials.maxRetriesPerRequest
    });
}