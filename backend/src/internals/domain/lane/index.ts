import type BaseFilter from "../../../packages/types/filter";

export type Lane = {
    id: string;
    creator: string;
    state: 'accepted' | 'completed' | 'failed'
    youtube: string
    startTime?: number
    endTime?: number
    challengeGenerated: boolean
    createdAt: Date;
    updatedAt: Date;
};

export type VideoRange = {
    startTime?: number
    endTime?: number
}

export type LaneFilter = {
    userId: string
} & BaseFilter