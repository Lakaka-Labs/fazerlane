import type LaneRepository from "../../domain/lane/repository.ts";
import type {Lane, LaneFilter} from "../../domain/lane";
import {SQL} from "bun";

export default class LanePG implements LaneRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    async update(id: string, lane: Partial<Pick<Lane, "challengeGenerated" | "state">>): Promise<void> {
        if (Object.keys(lane).length === 0) {
            return;
        }

        const updateData: any = {};
        if (lane.challengeGenerated) {
            updateData.challenge_generated = lane.challengeGenerated
        }
        if (lane.state) {
            updateData.state = lane.state
        }

        await this.sql`UPDATE lanes
                       SET ${this.sql(updateData)}
                       WHERE id = ${id}`;
    };

    async create(creator: string, youtube: string, startTime?: number, endTime?:number): Promise<string> {
        return await this.sql.begin(async tx => {
            const laneRow = {
                creator,
                youtube,
                ...(startTime && {start_time: startTime}),
                ...(endTime && {end_time: endTime})
            };
            const [{id}] =
                await tx`INSERT INTO lanes ${tx(laneRow)} RETURNING id`;

            await tx`INSERT INTO user_lanes (user_id, lane_id)
                     VALUES (${creator}, ${id})`
            return id;
        })
    }

    async getById(id: string): Promise<Lane> {
        let rows = await this.sql`SELECT *
                                  FROM lanes
                                  WHERE id = ${id}
                                  LIMIT 1`

        const row = rows[0];
        return {
            id: row.id,
            creator: row.creator,
            state: row.state,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            youtube: row.youtube,
            startTime: row.start_time,
            endTime: row.end_time,
            challengeGenerated: row.challenge_generated
        }
    }

    async getLanes(filter: LaneFilter): Promise<Lane[]> {
        let query = this.sql`
            SELECT l.*
            FROM lanes l
                     INNER JOIN user_lanes ul ON l.id = ul.lane_id
            WHERE ul.user_id = ${filter.userId}
        `;

        if (filter.limit) {
            query = this.sql`${query} LIMIT ${filter.limit}`;
        }

        if (filter.page) {
            query = this.sql`${query} OFFSET ${(filter.page - 1) * (filter.limit || 20)}`;
        }

        const rows = await query;

        return rows.map((row: any) => ({
            id: row.id,
            creator: row.creator,
            state: row.state,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            youtube: row.youtube,
            startTime: row.start_time,
            endTime: row.end_time,
            challengeGenerated: row.challenge_generated
        }));
    }

    async addLane(id: string, userId: string): Promise<void> {
        await this.sql`INSERT INTO user_lanes (user_id, lane_id)
                       VALUES (${userId}, ${id})
                       ON CONFLICT (user_id, lane_id) DO NOTHING`;
    }
}