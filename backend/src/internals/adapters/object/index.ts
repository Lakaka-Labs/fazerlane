import {SQL} from "bun";
import type {ObjectRepository} from "../../domain/objects/repository.ts";
import type {StorageObject} from "../../domain/objects";

export default class ObjectPG implements ObjectRepository {
    sql: SQL;

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    async add(objects: Omit<StorageObject, 'lastAccessed' | 'createdAt' | 'id'>[]): Promise<string[]> {
        const parameters = objects.map((o) => ({
            public_url: o.publicUrl,
            llm_url: o.llmUrl,
            mime_type: o.mimeType,
            user_id: o.userId
        }));

        const insertedObjects = await this.sql`
            INSERT INTO storage_objects ${this.sql(parameters)}
                RETURNING id
        `;

        const ids: string[] = [];
        insertedObjects.forEach((row: any) => {
            ids.push(row.id);
        });

        return ids
    }

    async get(ids: string[]): Promise<StorageObject[]> {
        if (ids.length === 0) {
            return [];
        }

        const rows = await this.sql`
            SELECT id, public_url, llm_url, mime_type, created_at, last_accessed
            FROM storage_objects
            WHERE id = ANY (${ids})
        `;

        return rows.map((row: any) => ({
            id: row.id,
            publicUrl: row.public_url,
            llmUrl: row.llm_url,
            mimeType: row.mime_type,
            userId: row.user_id,
            createdAt: row.created_at,
            lastAccessed: row.last_accessed,
        }));
    }
};