import {SQL} from "bun";
import type ChallengeRepository from "../../domain/challenge/repository.ts";
import type {Challenge, Attempt} from "../../domain/challenge";
import {DuplicateError, NotFoundError} from "../../../packages/errors";
import type BaseFilter from "../../../packages/types/filter";

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
                submission_format: `{${c.submissionFormat.map((item) => `${item}`).join(',')}}`,
                difficulty: c.difficulty,
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

    get = async (laneId: string, userId?: string): Promise<Challenge[]> => {
        // Get challenges with their references and user completion/attempt data
        const result = await this.sql`
            SELECT c.id,
                   c.lane,
                   c.title,
                   c.objective,
                   c.instruction,
                   c.assignment,
                   c.submission_format,
                   c.difficulty,

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
                   ) as "references",

                   -- User completion status (only when userId is provided)
                   ${userId ? this.sql`
                   CASE 
                       WHEN cu.user_id IS NOT NULL THEN true 
                       ELSE false 
                   END as "isCompleted",
                   
                   -- Count of attempts for this user and challenge
                   COALESCE(ca.attempts_count, 0) as "attemptsCount"
               ` : this.sql`
                   NULL as "isCompleted",
                   NULL as "attemptsCount"
               `}

            FROM challenges c
                     LEFT JOIN challenge_references cr ON c.id = cr.challenge
                ${userId ? this.sql`
                     LEFT JOIN challenge_users cu ON c.id = cu.challenge_id AND cu.user_id = ${userId}
                     LEFT JOIN (
                         SELECT 
                             challenge_id, 
                             COUNT(*) as attempts_count
                         FROM challenge_attempts 
                         WHERE user_id = ${userId}
                         GROUP BY challenge_id
                     ) ca ON c.id = ca.challenge_id
                 ` : this.sql``}
            WHERE c.lane = ${laneId}
            GROUP BY c.id, c.lane, c.title, c.objective, c.instruction, c.assignment, c.submission_format, c.difficulty,
                     c.position
                         ${userId ? this.sql`, cu.user_id, ca.attempts_count` : this.sql``}
            ORDER BY c.position
        `;

        // Transform the result to match the Challenge type structure
        return result.map((row: any) => {
            const challenge: Challenge = {
                id: row.id,
                lane: row.lane,
                title: row.title,
                objective: row.objective,
                instruction: row.instruction,
                assignment: row.assignment,
                submissionFormat: Array.isArray(row.submission_format) ? row.submission_format : [],
                references: Array.isArray(row.references) ? row.references : [],
                difficulty: row.difficulty,
            };

            // Add optional fields only when userId is provided
            if (userId) {
                challenge.isCompleted = row.isCompleted;
                challenge.attemptsCount = row.attemptsCount;
            }

            return challenge;
        });
    };

    getById = async (id: string): Promise<Challenge> => {
        const result = await this.sql`
            SELECT c.id,
                   c.lane,
                   c.title,
                   c.objective,
                   c.instruction,
                   c.assignment,
                   c.submission_format,
                   c.difficulty,
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
            GROUP BY c.id
        `;

        const challenges = result.map((row: any) => {
            const challenge: Challenge = {
                id: row.id,
                lane: row.lane,
                title: row.title,
                objective: row.objective,
                instruction: row.instruction || [],
                assignment: row.assignment,
                submissionFormat: row.submission_format,
                references: Array.isArray(row.references) ? row.references : [],
                difficulty: row.difficulty,
            };
            return challenge;
        });
        if (challenges.length < 1) throw new NotFoundError("challenge does not exist")
        return challenges[0]
    };

    getChallengeOrder = async (laneId: string): Promise<{ id: string, position: number, title: string }[]> => {
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

    unmarkChallenges = async (ids: string[], user_id: string): Promise<void> => {
        if (ids.length === 0) return;

        await this.sql`
            DELETE
            FROM challenge_users
            WHERE user_id = ${user_id}
              AND challenge_id = ANY (${`{${ids.map((id) => `"${id}"`).join(',')}}`})
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

    addAttempt = async (feedback: Omit<Attempt, "id" | "createdAt">): Promise<void> => {
        await this.sql.begin(async tx => {
            await tx`
                INSERT INTO challenge_attempts (user_id, challenge_id, feedback, pass)
                VALUES (${feedback.userId}, ${feedback.challengeId}, ${feedback.feedback}, ${feedback.pass})
            `;
            if (feedback.pass) await tx`
                INSERT INTO challenge_users (user_id, challenge_id)
                VALUES (${feedback.userId}, ${feedback.challengeId})
                ON CONFLICT (user_id, challenge_id) DO NOTHING
            `;
        });
    };

    getAttempts = async (id: string, userId: string, filter?: BaseFilter): Promise<Attempt[]> => {
        const page = filter?.page || 1;
        const limit = filter?.limit || 10;
        const offset = (page - 1) * limit;

        const result = await this.sql`
            SELECT id,
                   user_id      as "userId",
                   challenge_id as "challengeId",
                   feedback,
                   pass,
                   created_at   as "createdAt"
            FROM challenge_attempts
            WHERE challenge_id = ${id}
              AND user_id = ${userId}
            ORDER BY created_at DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        return result.map((row: any) => ({
            id: row.id,
            userId: row.userId,
            challengeId: row.challengeId,
            feedback: row.feedback,
            pass: row.pass,
            createdAt: row.createdAt
        }));
    };

    getTotalAttemptCount = async (id: string, userId: string): Promise<number> => {
        const result = await this.sql`
        SELECT COUNT(*) as count
        FROM challenge_attempts
        WHERE challenge_id = ${id}
          AND user_id = ${userId}
    `;

        return parseInt(result[0].count, 10);
    };
}