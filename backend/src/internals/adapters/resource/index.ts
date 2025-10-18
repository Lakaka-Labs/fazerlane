import type ResourceRepository from "../../domain/resource/repository.ts";
import type {Segment, Youtube} from "../../domain/resource";
import {SQL} from "bun";
import {BadRequestError, DuplicateError, NotFoundError} from "../../../packages/errors";
import {BAD_REQUEST} from "http-status-codes";

export default class SegmentPG implements ResourceRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    addYoutubes = async (youtubes: Youtube[])  :Promise<string[]> => {
        const newVideos =
            await this.sql<{ id: string }[]>`INSERT INTO youtubes ${this.sql(youtubes)} ON CONFLICT (id) DO UPDATE SET duration = youtubes.duration RETURNING id`;
        return newVideos.map(({id})=> {
            return id
        })
    }

    getYoutubes = async (ids: string[]) => {
        if (ids.length === 0) return [];

        return this.sql<Youtube[]>`
            SELECT id,
                   title,
                   duration,
                   thumbnail
            FROM youtubes
            WHERE id IN ${this.sql(ids)}
        `;
    }
}