import {SQL} from "bun";
import type {ChatRepository} from "../../domain/chat/repository.ts";
import type {Conversation, ConversationFilter, Message, MessageFilter} from "../../domain/chat";
import {NotFoundError} from "../../../packages/errors";

export default class ChatPG implements ChatRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    createConversation = async (userId: string, laneId: string, title: string): Promise<string> => {
        const [result] = await this.sql`
            INSERT INTO conversations (user_id, lane_id, title)
            VALUES (${userId}, ${laneId}, ${title})
            RETURNING id
        `;
        return result.id;
    };

    updateConversation = async (conversationId: string, params: Partial<Conversation>): Promise<void> => {
        // Build dynamic update fields, excluding id and timestamps
        const updateFields: Record<string, any> = {};

        if (params.title) updateFields.title = params.title;
        if (params.generating !== undefined) updateFields.generating = params.generating;

        if (Object.keys(updateFields).length === 0) {
            return;
        }

        await this.sql`
            UPDATE conversations
            SET ${this.sql(updateFields)}
            WHERE id = ${conversationId}
        `;
    };

    GetConversations = async (filter: ConversationFilter): Promise<Conversation[]> => {
        const conditions: any[] = [];

        if (filter.userId) {
            conditions.push(this.sql`user_id = ${filter.userId}`);
        }
        if (filter.laneId) {
            conditions.push(this.sql`lane_id = ${filter.laneId}`);
        }
        if (filter.title) {
            conditions.push(this.sql`title ILIKE ${`%${filter.title}%`}`);
        }
        if (filter.startDate) {
            conditions.push(this.sql`created_at >= to_timestamp(${filter.startDate})`);
        }
        if (filter.endDate) {
            conditions.push(this.sql`created_at <= to_timestamp(${filter.endDate})`);
        }

        const limit = filter.limit || 10;
        const offset = ((filter.page || 1) - 1) * limit;

        // Build the query conditionally
        let query;
        if (conditions.length === 0) {
            query = this.sql`
                SELECT id,
                       user_id    as "userId",
                       lane_id    as "laneId",
                       title,
                       generating,
                       created_at as "createdAt",
                       updated_at as "updatedAt"
                FROM conversations
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `;
        } else {
            // Join conditions with AND manually
            let whereClause = conditions[0];
            for (let i = 1; i < conditions.length; i++) {
                whereClause = this.sql`${whereClause} AND ${conditions[i]}`;
            }

            query = this.sql`
                SELECT id,
                       user_id    as "userId",
                       lane_id    as "laneId",
                       title,
                       generating,
                       created_at as "createdAt",
                       updated_at as "updatedAt"
                FROM conversations
                WHERE ${whereClause}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `;
        }

        const results = await query;

        return results.map((row: any) => ({
            id: row.id,
            userId: row.userId,
            laneId: row.laneId,
            title: row.title,
            generating: row.generating,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }));
    };

    GetConversation = async (conversationId: string, userId: string): Promise<Conversation> => {
        const results = await this.sql`
            SELECT id,
                   user_id    as "userId",
                   lane_id    as "laneId",
                   title,
                   generating,
                   created_at as "createdAt",
                   updated_at as "updatedAt"
            FROM conversations
            WHERE id = ${conversationId}
              AND user_id = ${userId}
        `;

        if (!results[0]) throw new NotFoundError("conversation not found")
        let row = results[0]

        return {
            id: row.id,
            userId: row.userId,
            laneId: row.laneId,
            title: row.title,
            generating: row.generating,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    };

    AddMessage = async (message: Omit<Message, "id" | "token" | "updatedAt" | "createdAt">): Promise<string> => {
        const [result] = await this.sql`
            INSERT INTO messages (conversation_id, role, content)
            VALUES (${message.conversationId}, ${message.role}, ${message.content})
            RETURNING id
        `;
        return result.id;
    };

    AddChunkToMessage = async (messageId: string, content: string, token: number): Promise<void> => {
        await this.sql`
            UPDATE messages
            SET content = content || ${content},
                token   = ${token}
            WHERE id = ${messageId}
        `;
    };

    EditMessage = async (messageId: string, content: string, token: number): Promise<void> => {
        await this.sql.begin(async tx => {
            // Get the message's timestamp and conversation_id
            const [message] = await tx`
                SELECT created_at, conversation_id
                FROM messages
                WHERE id = ${messageId}
            `;

            if (!message) {
                throw new Error(`Message with id ${messageId} not found`);
            }

            await tx`
                DELETE
                FROM messages
                WHERE conversation_id = ${message.conversation_id}
                  AND created_at > ${message.created_at}
            `;

            await tx`
                UPDATE messages
                SET content = ${content},
                    token   = token
                WHERE id = ${messageId}
            `;
        });
    };

    GetConversationHistory = async (filter: MessageFilter): Promise<Message[]> => {
        const limit = filter.limit || 50;
        const offset = ((filter.page || 1) - 1) * limit;

        let results;

        if (filter.conversationId) {
            results = await this.sql`
                SELECT id,
                       conversation_id as "conversationId",
                       role,
                       content,
                       token,
                       created_at      as "createdAt",
                       updated_at      as "updatedAt"
                FROM messages
                WHERE conversation_id = ${filter.conversationId}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `;
        } else {
            results = await this.sql`
                SELECT id,
                       conversation_id as "conversationId",
                       role,
                       content,
                       token,
                       created_at      as "createdAt",
                       updated_at      as "updatedAt"
                FROM messages
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}
            `;
        }

        return results.map((row: any) => ({
            id: row.id,
            conversationId: row.conversationId,
            role: row.role,
            content: row.content,
            token: row.token,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }));
    };
}