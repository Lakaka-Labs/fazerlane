import type BaseFilter from "../../../packages/types/filter";
import type {Youtube} from "../resource";

export type Lane = {
    id: string;
    creator: string;
    state: 'accepted' | 'completed' | 'failed'
    youtube: string
    startTime?: number
    endTime?: number
    challengeGenerated: boolean
    featured: boolean
    createdAt: Date;
    updatedAt: Date;
    youtubeDetails?: Youtube
    totalChallenges?: number
    challengesPassed?: number
    totalAttempts?: number
};

export type VideoRange = {
    startTime?: number
    endTime?: number
}

export type LaneFilter = {
    userId: string
} & BaseFilter