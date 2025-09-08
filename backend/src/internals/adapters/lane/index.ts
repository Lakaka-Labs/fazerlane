import type LaneRepository from "../../domain/lane/repository.ts";
import type {Lane, LaneFilter, Youtube} from "../../domain/lane";
import {SQL} from "bun";

export default class LaneRepositoryPG implements LaneRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    async create(
        lane: Omit<Lane, 'createdAt' | 'updatedAt' | 'id'>,
        youtubes: Youtube[]
    ): Promise<string> {
        const newVideos =
            await this.sql`INSERT INTO youtubes ${this.sql(youtubes)} ON CONFLICT (id) DO UPDATE SET duration = youtubes.duration RETURNING id`;
        const laneRow = {
            ...lane,
            youtubes: `{${newVideos.map((v: { id: string }) => `"${v.id}"`).join(',')}}`,
        };
        const [{ id }] =
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