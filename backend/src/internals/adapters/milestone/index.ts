import type {Milestone} from "../../domain/milestone";
import type MilestoneRepository from "../../domain/milestone/repository.ts";
import {SQL} from "bun";

export default class MilestonePG implements MilestoneRepository {
    sql: SQL

    constructor(postgresClient: SQL) {
        this.sql = postgresClient
    }

    add = async (laneId: string, milestones: Omit<Milestone, "id" | "lane">[]): Promise<void> => {
        await this.sql.begin(async tx => {
            console.log("deleted 1")
            await tx`DELETE
                     FROM milestones
                     WHERE lane = ${laneId}`;
            console.log("deleted 2")

            const milestonesParameter = milestones.map((m) => {
                return {
                    lane: laneId,
                    goal: m.goal,
                    description: m.description,
                    estimated_duration: m.estimatedDuration,
                    recommended_resources: `{${m.recommendedResources.map((item) => {
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
        return this.sql<Milestone[]>`
            SELECT id,
                   lane,
                   goal,
                   description,
                   estimated_duration    as "estimatedDuration",
                   recommended_resources as "recommendedResources"
            FROM milestones
            WHERE lane = ${laneId}
        `;
    };
}