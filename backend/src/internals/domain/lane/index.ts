import type BaseFilter from "../../../packages/types/filter";

export type Lane = {
    id: string;
    creator: string;
    state: 'accepted' | 'completed' | 'failed'
    youtube: string
    challengeGenerated: boolean
    createdAt: Date;
    updatedAt: Date;
};

export type LaneFilter = {
    userId: string
} & BaseFilter