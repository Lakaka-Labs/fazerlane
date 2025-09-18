import {SQL} from "bun";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type {Challenge} from "../../domain/challenge";
import {DuplicateError, NotFoundError} from "../../../packages/errors";

export default class ChallengePG implements ChallengeRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }


    add = async (laneId: string, challenges: Omit<Challenge, "id" | "lane">[]): Promise<void> => {
        await this.sql.begin(async tx => {
            await tx`DELETE
                     FROM challenges
                     WHERE lane = ${laneId}`;

            const challengeParameters = challenges.map((c) => ({
                lane: laneId,
                title: c.title,
                objective: c.objective,
                instruction: c.instruction,
                assignment: c.assignment,
                submission_format: c.submissionFormat,
                success_criteria: c.successCriteria,
            }));

            const insertedChallenges = await tx`
                INSERT INTO challenges ${tx(challengeParameters)}
                    RETURNING id, title
            `;

            const challengeIdMap = new Map<string, string>();
            insertedChallenges.forEach((row: any) => {
                challengeIdMap.set(row.title, row.id);
            });

            // Prepare and insert references
            const allReferences: any = [];
            challenges.forEach((challenge) => {
                const challengeId = challengeIdMap.get(challenge.title);
                if (challengeId && challenge.references) {
                    challenge.references.forEach((ref) => {
                        allReferences.push({
                            challenge: challengeId,
                            start_time: ref.location.startTime,
                            end_time: ref.location.endTime,
                            purpose: ref.purpose,
                        });
                    });
                }
            });

            if (allReferences.length > 0) {
                await tx`INSERT INTO challenge_references ${tx(allReferences)}`;
            }
        });
    };

    get = async (laneId: string): Promise<Challenge[]> => {
        // Get challenges with their references and quizzes
        const result = await this.sql`
            SELECT c.id,
                   c.lane,
                   c.title,
                   c.objective,
                   c.instruction,
                   c.assignment,
                   c.submission_format,
                   c.success_criteria,

                   -- References as JSON aggregation
                   COALESCE(
                                   JSON_AGG(
                                   CASE
                                       WHEN cr.id IS NOT NULL THEN
                                           JSON_BUILD_OBJECT(
                                                   'challenge', c.title,
                                                   'location', JSON_BUILD_OBJECT(
                                                           'startTime', cr.start_time,
                                                           'endTime', cr.end_time
                                                               ),
                                                   'purpose', cr.purpose
                                           )
                                       END
                                           ) FILTER (WHERE cr.id IS NOT NULL),
                                   '[]'::json
                   ) as "references"
            FROM challenges c
                     LEFT JOIN challenge_references cr ON c.id = cr.challenge
            WHERE c.lane = ${laneId}
            GROUP BY c.id, c.lane, c.title, c.objective, c.instruction, c.assignment, c.submission_format,
                     c.success_criteria,c.position
            ORDER BY c.position
        `;

        // Transform the result to match the Challenge type structure
        return result.map((row: any) => ({
            id: row.id,
            lane: row.lane,
            title: row.title,
            objective: row.objective,
            instruction: row.instruction || [],
            assignment: row.assignment,
            submissionFormat: row.submission_format as 'video' | 'images' | 'audio' | 'text',
            references: Array.isArray(row.references) ? row.references : [],
            successCriteria: row.success_criteria,
        }));
    };

    getChallengeDetails = async (id: string): Promise<Challenge> => {
        const result = await this.sql`
            SELECT c.id,
                   c.lane,
                   c.title,
                   c.objective,
                   c.instruction,
                   c.assignment,
                   c.submission_format,
                   c.success_criteria,

                   -- References as JSON aggregation
                   COALESCE(
                                   JSON_AGG(
                                   CASE
                                       WHEN cr.id IS NOT NULL THEN
                                           JSON_BUILD_OBJECT(
                                                   'challenge', c.title,
                                                   'location', JSON_BUILD_OBJECT(
                                                           'startTime', cr.start_time,
                                                           'endTime', cr.end_time
                                                               ),
                                                   'purpose', cr.purpose
                                           )
                                       END
                                           ) FILTER (WHERE cr.id IS NOT NULL),
                                   '[]'::json
                   ) as "references"
            FROM challenges c
                     LEFT JOIN challenge_references cr ON c.id = cr.challenge
            WHERE c.id = ${id}
            GROUP BY c.id, c.lane, c.title, c.objective, c.instruction, c.assignment, c.submission_format,
                     c.success_criteria
        `;

        if (result.length === 0) {
            throw new NotFoundError("challenge does not exist")
        }

        const row = result[0];
        return {
            id: row.id,
            lane: row.lane,
            title: row.title,
            objective: row.objective,
            instruction: row.instruction || [],
            assignment: row.assignment,
            submissionFormat: row.submission_format as 'video' | 'images' | 'audio' | 'text',
            references: Array.isArray(row.references) ? row.references : [],
            successCriteria: row.success_criteria,
        };
    };

    getChallengeOrder = async (laneId: string): Promise<{id: string, position: number,title: string}[]> => {
        const result = await this.sql`
            SELECT id,
                   title,
                   position
            FROM challenges
            WHERE lane = ${laneId}
            ORDER BY position
        `;

        return result.map((row: any) => ({
            id: row.id,
            title: row.title,
            position: row.position,
        }));
    };

    markChallenge = async (id: string, user_id: string): Promise<void> => {
        await this.sql`
            INSERT INTO challenge_users (user_id, challenge_id)
            VALUES (${user_id}, ${id})
            ON CONFLICT (user_id, challenge_id) DO NOTHING
        `;
    };

    unmarkChallenges = async (ids: string[], user_id: string): Promise<void> => {
        if (ids.length === 0) return;

        await this.sql`
            DELETE FROM challenge_users
            WHERE user_id = ${user_id}
            AND challenge_id = ANY(${`{${ids.map((id) => `"${id}"`).join(',')}}`})
        `;
    };

    getCompletedChallenges = async (laneId: string, user_id: string): Promise<string[]> => {
        const result = await this.sql`
            SELECT cu.challenge_id
            FROM challenge_users cu
            JOIN challenges c ON cu.challenge_id = c.id
            WHERE c.lane = ${laneId}
            AND cu.user_id = ${user_id}
        `;

        return result.map((row: any) => row.challenge_id);
    };

}