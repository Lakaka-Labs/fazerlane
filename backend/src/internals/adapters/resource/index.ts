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

    addSegment = async (segments: Omit<Segment, "id" | "youtube">[], youtubeId: string) => {
        await this.sql.begin(async tx => {
            const winners =
                await tx`UPDATE youtubes
                   SET segmented = true
                 WHERE id        = ${youtubeId}
                   AND segmented = false
                 RETURNING 1`;

            if (winners.count === 0) {
                throw new DuplicateError("already segmented")
            }

            const segmentsParameters = segments.map((s) => {
                return {
                    youtube: youtubeId,
                    start_time: s.startTime,
                    end_time: s.endTime,
                    title: s.title,
                    summary: s.summary,
                    learning_objectives: `{${s.learningObjectives.map((lo) => `"${lo}"`).join(',')}}`,
                    visual_elements: `{${s.visualElements.map((ve) => `"${ve}"`).join(',')}}`,
                    transcription: s.transcription,
                }
            })

            await tx`INSERT INTO segments ${this.sql(segmentsParameters)}`;
        });
    }

    getSegment = async (youtubeIds: string[]) => {
        if (youtubeIds.length === 0) return [];

        return this.sql<Segment[]>`
            SELECT id,
                   youtube,
                   start_time          as "startTime",
                   end_time            as "endTime",
                   title,
                   summary,
                   learning_objectives as "learningObjectives",
                   visual_elements     as "visualElements",
                   transcription
            FROM segments
            WHERE youtube IN ${this.sql(youtubeIds)}
            ORDER BY start_time
        `;
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
                   duration          ,
                   segmented           
            FROM youtubes
            WHERE id IN ${this.sql(ids)}
        `;
    }
}