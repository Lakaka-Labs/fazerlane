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
    submissionFormat: 'video' | 'images' | 'audio' | 'text';
    references: Reference[];
};