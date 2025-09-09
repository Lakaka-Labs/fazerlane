export type Reference = {
    challenge: string;
    segment: string;
    reference_location: {
        startTime: string;
        endTime: string;
    };
    reference_location_description: string;
    reference_purpose: string;
};

export type Quiz =
    | {
    challenge: string;
    type: 'single_choice';
    question: string;
    options: string[];
    correct_answer: string;
}
    | {
    challenge: string;
    type: 'multiple_choice';
    question: string;
    options: string[];
    correct_answers: string[];
}
    | {
    challenge: string;
    type: 'true_false';
    question: string;
    correct_answer: boolean;
}
    | {
    challenge: string;
    type: 'sequence';
    question: string;
    options: string[];
    correct_order: string[];
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
    min_value: number;
    max_value: number;
    correct_range: { min: number; max: number };
    unit: string;
};

export type challenge = {
    id: string,
    milestone: string,
    challenge_title: string;
    objective: string;
    prerequisite_challenges: string[];
    builds_on_context?: string;
    practice_instructions: string[];
    assignment: string;
    submission_format: 'video' | 'images' | 'audio' | 'text';
    references: Reference[];
    quizzes: Quiz[];
    success_criteria: string;
    memory_adaptations?: string;
};