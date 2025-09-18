export type Reference = {
    challenge: string;
    location: {
        startTime: string;
        endTime: string;
    };
    purpose: string;
};

export type Challenge = {
    id: string,
    lane: string,
    title: string;
    objective: string;
    instruction: string;
    assignment: string;
    successCriteria: string;
    submissionFormat: 'video' | 'image' | 'audio' | 'text' | 'code';
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