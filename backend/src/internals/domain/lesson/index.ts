export type Reference = {
    lesson: string;
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
    lesson: string;
    type: 'single_choice';
    question: string;
    options: string[];
    correct_answer: string;
}
    | {
    lesson: string;
    type: 'multiple_choice';
    question: string;
    options: string[];
    correct_answers: string[];
}
    | {
    lesson: string;
    type: 'true_false';
    question: string;
    correct_answer: boolean;
}
    | {
    lesson: string;
    type: 'sequence';
    question: string;
    options: string[];
    correct_order: string[];
}
    | {
    lesson: string;
    type: 'drag_drop';
    question: string;
    pairs: { item: string; match: string }[];
}
    | {
    lesson: string;
    type: 'slider';
    question: string;
    min_value: number;
    max_value: number;
    correct_range: { min: number; max: number };
    unit: string;
};

export type Lesson = {
    id: string,
    phase: string,
    lesson_title: string;
    objective: string;
    prerequisite_lessons: string[];
    builds_on_context?: string;
    practice_instructions: string[];
    assignment: string;
    submission_format: 'video' | 'images' | 'audio' | 'text';
    references: Reference[];
    quizzes: Quiz[];
    success_criteria: string;
    memory_adaptations?: string;
};