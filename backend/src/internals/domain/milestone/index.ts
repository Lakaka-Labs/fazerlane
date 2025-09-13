export type Milestone = {
    id: string;
    lane: string;
    goal: string;
    description: string;
    estimatedDuration: string;
    recommendedResources: number[];
    challengeGenerated: boolean
};