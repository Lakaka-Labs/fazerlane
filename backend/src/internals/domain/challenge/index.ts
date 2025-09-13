export type Reference = {
    challenge: string;
    segment: string;
    referenceLocation: {
        startTime: string;
        endTime: string;
    };
    referenceLocationDescription: string;
    referencePurpose: string;
};

export type Quiz =
    | {
    challenge: string;
    type: 'single_choice';
    question: string;
    options: string[];
    correctAnswer: string;
}
    | {
    challenge: string;
    type: 'multiple_choice';
    question: string;
    options: string[];
    correctAnswers: string[];
}
    | {
    challenge: string;
    type: 'true_false';
    question: string;
    correctAnswer: boolean;
}
    | {
    challenge: string;
    type: 'sequence';
    question: string;
    options: string[];
    correctOrder: string[];
}
    | {
    challenge: string;
    type: 'drag_drop';
    question: string;
    pairs: { item: string; match: string }[];
}
    | {
    challenge: string;
    type: 'slider';
    question: string;
    minValue: number;
    maxValue: number;
    correctRange: { min: number; max: number };
    unit: string;
};

export type Challenge = {
    id: string,
    milestone: string,
    challengeTitle: string;
    objective: string;
    prerequisiteChallenges: string[];
    buildsOnContext?: string;
    practiceInstructions: string[];
    assignment: string;
    submissionFormat: 'video' | 'images' | 'audio' | 'text';
    references: Reference[];
    quizzes: Quiz[];
    successCriteria: string;
    memoryAdaptations?: string;
};