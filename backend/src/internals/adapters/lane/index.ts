import type LaneRepository from "../../domain/lane/repository.ts";
import type {Lane, LaneFilter} from "../../domain/lane";
import {SQL} from "bun";
import type {Youtube} from "../../domain/resource";

export default class LanePG implements LaneRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    async update(id: string, lane: Partial<Omit<Lane, "createdAt" | "updatedAt" | "id" | "creator">>): Promise<void> {
        if (Object.keys(lane).length === 0) {
            return;
        }

        const updateData: any = { ...lane };
        if (lane.youtubes) {
            updateData.youtubes = `{${lane.youtubes.map((id) => `"${id}"`).join(',')}}`;
        }

        await this.sql`UPDATE lanes SET ${this.sql(updateData)} WHERE id = ${id}`;
    };

    async create(
        lane: Omit<Lane, 'createdAt' | 'updatedAt' | 'id' | 'state'>
    ): Promise<string> {
        const laneRow = {
            ...lane,
            youtubes: `{${lane.youtubes.map((id) => `"${id}"`).join(',')}}`,
        };
        const [{id}] =
            await this.sql`INSERT INTO lanes ${this.sql(laneRow)} RETURNING id`;
        return id;
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
            name: row.name,
            state: row.state,
            goal: row.goal,
            schedule: row.schedule,
            experience: row.experience,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            youtubes: row.youtubes,
        }
    }

    async getMany(filter: LaneFilter): Promise<Lane[]> {
        return Promise.resolve([]);
    }

}