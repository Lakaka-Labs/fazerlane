import type BaseFilter from "../../../packages/types/filter";

export type Reference = {
    challenge: string;
    location: {
        startTime: string;
        endTime: string;
    };
    purpose: string;
};

export type SubmissionFormat = 'video' | 'image' | 'audio' | 'text' | 'code'

export type Challenge = {
    id: string,
    lane: string,
    title: string;
    objective: string;
    instruction: string;
    assignment: string;
    difficulty: 'easy' | 'medium' | 'hard';
    submissionFormat: SubmissionFormat[];
    references: Reference[];
    position: number
    isCompleted?: boolean;
    attemptsCount?: number
};

export type ChallengeFilter = BaseFilter & { fromPosition?: number, toPosition?: number, order?: "asc" | "desc"  }

export type Attempt = {
    id: string
    userId: string
    challengeId: string
    feedback: string
    pass: boolean
    files?: string[]
    textSubmission?: string
    comment?: string
    createdAt: Date
}