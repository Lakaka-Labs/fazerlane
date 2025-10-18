import type BaseFilter from "../../../packages/types/filter";
import {formatHumanReadableTimestamp} from "../../../packages/utils/time.ts";

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
    embedding?: number[]
    isCompleted?: boolean;
    attemptsCount?: number;
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

export function convertChallengeToString(input: Omit<Challenge , "id" | "lane">): string {
    const submissionFormats = input.submissionFormat.join(',');
    const referencesString = formatReferences(input.references);

    return `title: ${input.title} | objective: ${input.objective} | instruction: ${input.instruction} | assignment: ${input.assignment} | difficulty: ${input.difficulty} | submissionFormat: ${submissionFormats} | references: ${referencesString}`;
}
function formatReferences(references: Reference[]): string {
    return references.map(ref =>
        `${ref.location.startTime}-${ref.location.endTime}: ${ref.purpose}`
    ).join('; ');
}

