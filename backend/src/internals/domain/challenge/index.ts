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
    isCompleted?: boolean;
    attemptsCount?: number
};

export type Attempt = {
    id: string
    userId: string
    challengeId: string
    feedback: string
    pass: boolean
    createdAt: Date
}