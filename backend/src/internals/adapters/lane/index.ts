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

    async create(creator: string, youtube: string, startTime?: number, endTime?: number): Promise<string> {
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

    async getById(id: string, userId?: string): Promise<Lane> {
        let rows = await this.sql`
            SELECT l.*,
                   y.id        as youtube_id,
                   y.title     as youtube_title,
                   y.duration  as youtube_duration,
                   y.thumbnail as youtube_thumbnail
                ${userId ? this.sql`,
               (SELECT COUNT(*) FROM challenges WHERE lane = l.id) as total_challenges,
               (SELECT COUNT(DISTINCT cu.challenge_id) 
                FROM challenge_users cu 
                INNER JOIN challenges c ON cu.challenge_id = c.id 
                WHERE c.lane = l.id AND cu.user_id = ${userId}) as challenges_passed,
               (SELECT COALESCE(SUM(attempts_count), 0)
                FROM (
                    SELECT COUNT(*) as attempts_count
                    FROM challenge_attempts ca
                    INNER JOIN challenges c ON ca.challenge_id = c.id
                    WHERE c.lane = l.id AND ca.user_id = ${userId}
                    GROUP BY ca.challenge_id
                ) subquery) as total_attempts
               ` : this.sql``}
            FROM lanes l
                     LEFT JOIN youtubes y ON l.youtube = y.id
            WHERE l.id = ${id}
            LIMIT 1
        `;

        const row = rows[0];
        const lane: Lane = {
            id: row.id,
            creator: row.creator,
            state: row.state,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            youtube: row.youtube,
            startTime: row.start_time,
            endTime: row.end_time,
            challengeGenerated: row.challenge_generated,
            youtubeDetails: row.youtube_id ? {
                id: row.youtube_id,
                title: row.youtube_title,
                duration: row.youtube_duration,
                thumbnail: row.youtube_thumbnail
            } : undefined
        };

        // Add user-specific statistics when userId is provided
        if (userId) {
            lane.totalChallenges = row.total_challenges;
            lane.challengesPassed = row.challenges_passed;
            lane.totalAttempts = row.total_attempts;
        }

        return lane;
    }

    async getLanes(filter: LaneFilter): Promise<Lane[]> {
        const userId = filter.userId;

        let query = this.sql`
            SELECT l.*,
                   y.id                                                as youtube_id,
                   y.title                                             as youtube_title,
                   y.duration                                          as youtube_duration,
                   y.thumbnail                                         as youtube_thumbnail,
                   (SELECT COUNT(*) FROM challenges WHERE lane = l.id) as total_challenges,
                   (SELECT COUNT(DISTINCT cu.challenge_id)
                    FROM challenge_users cu
                             INNER JOIN challenges c ON cu.challenge_id = c.id
                    WHERE c.lane = l.id
                      AND cu.user_id = ${userId})                      as challenges_passed,
                   (SELECT COALESCE(SUM(attempts_count), 0)
                    FROM (SELECT COUNT(*) as attempts_count
                          FROM challenge_attempts ca
                                   INNER JOIN challenges c ON ca.challenge_id = c.id
                          WHERE c.lane = l.id
                            AND ca.user_id = ${userId}
                          GROUP BY ca.challenge_id) subquery)          as total_attempts
            FROM lanes l
                     INNER JOIN user_lanes ul ON l.id = ul.lane_id
                     LEFT JOIN youtubes y ON l.youtube = y.id
            WHERE ul.user_id = ${userId}
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
            challengeGenerated: row.challenge_generated,
            youtubeDetails: row.youtube_id ? {
                id: row.youtube_id,
                title: row.youtube_title,
                duration: row.youtube_duration,
                thumbnail: row.youtube_thumbnail
            } : undefined,
            totalChallenges: row.total_challenges,
            challengesPassed: row.challenges_passed,
            totalAttempts: row.total_attempts
        }));
    }

    async addLane(id: string, userId: string): Promise<void> {
        await this.sql`INSERT INTO user_lanes (user_id, lane_id)
                       VALUES (${userId}, ${id})
                       ON CONFLICT (user_id, lane_id) DO NOTHING`;
    }
}