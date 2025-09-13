import type {Milestone} from "../../domain/milestone";
import type MilestoneRepository from "../../domain/milestone/repository.ts";
import {SQL} from "bun";
import {NotFoundError} from "../../../packages/errors";

export default class MilestonePG implements MilestoneRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }


    add = async (laneId: string, milestones: Omit<Milestone, "id" | "lane">[]): Promise<void> => {
        await this.sql.begin(async tx => {
            await tx`DELETE
                     FROM milestones
                     WHERE lane = ${laneId}`;

            const milestonesParameter = milestones.map((m) => {
                return {
                    lane: laneId,
                    goal: m.goal,
                    description: m.description,
                    estimated_duration: m.estimatedDuration,
                    recommended_resources: `{${m.recommendedResources.map((item: any) => {
                        if (typeof item === 'number') {
                            return `${item}`;
                        } else {
                            return `${item.id}`; // depending on Segment structure
                        }

                    }).join(',')}}`,
                }
            });

            await tx`INSERT INTO milestones ${tx(milestonesParameter)}`;
        });
    };

    get = async (laneId: string): Promise<Milestone[]> => {
        const rows = await this.sql`
            SELECT id,
                   lane,
                   goal,
                   description,
                   estimated_duration            as "estimatedDuration",
                   recommended_resources::TEXT[] as "recommendedResources",
                   challenge_generated           as "challengeGenerated"
            FROM milestones
            WHERE lane = ${laneId}
        `;

        return rows.map((r: any): Milestone => {
            return {
                ...r,
                recommendedResources: r.recommendedResources.map((rr: string) => Number(rr))
            }
        })
    };
    getById = async (milestoneId: string): Promise<Milestone> => {
        const milestone = await this.sql<Milestone[]>`
            SELECT id,
                   lane,
                   goal,
                   description,
                   estimated_duration    as "estimatedDuration",
                   recommended_resources as "recommendedResources",
                   challenge_generated   as "challengeGenerated"
            FROM milestones
            WHERE id = ${milestoneId}
            LIMIT 1
        `;
        if (!milestone[0]) throw new NotFoundError("milestone does not exist")
        return milestone[0]
    };
}