import type ProgressRepository from "../../domain/progress/repository.ts";
import {SQL} from "bun";
import type {BaseProgress, Progress} from "../../domain/progress";
import type {Youtube} from "../../domain/resource";

export default class ProgressPG implements ProgressRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    add = async (progress: BaseProgress) => {
        await this.sql`INSERT INTO progresses ${this.sql(progress)} RETURNING id`;
    }

    get = async (laneId: string): Promise<Progress[]> => {
        return this.sql<Progress[]>`
            SELECT id,
                   lane,
                   type,
                   message,
                   created_at as "createdAt"
            FROM progresses
            WHERE lane = ${laneId}
            ORDER BY "createdAt" DESC 
        `;

    }

    delete = async (laneId: string): Promise<void> => {
        return this.sql`
            DELETE
            FROM progresses
            WHERE lane = ${laneId}
        `;
    }
}