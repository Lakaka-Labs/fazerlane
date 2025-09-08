CREATE TABLE lessons
(
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase                 UUID   NOT NULL REFERENCES phases (id) ON DELETE CASCADE,
    lesson_title          TEXT   NOT NULL UNIQUE,
    objective             TEXT   NOT NULL,
    prerequisite_lessons  TEXT[]           DEFAULT '{}',
    builds_on_context     TEXT,
    practice_instructions TEXT[] NOT NULL,
    assignment            TEXT   NOT NULL,
    submission_format     TEXT   NOT NULL CHECK (submission_format IN ('video', 'images', 'audio', 'text')),
    success_criteria      TEXT   NOT NULL,
    memory_adaptations    TEXT
);

CREATE TABLE lesson_references
(
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson               UUID NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    segment              TEXT NOT NULL,
    start_time           TEXT NOT NULL,
    end_time             TEXT NOT NULL,
    location_description TEXT NOT NULL,
    purpose              TEXT NOT NULL
);

CREATE TABLE lesson_quizzes
(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson          UUID NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    quiz_type       TEXT NOT NULL CHECK (quiz_type IN
                                         ('single_choice', 'multiple_choice', 'true_false', 'sequence', 'drag_drop',
                                          'slider')),
    question        TEXT NOT NULL,
    options         TEXT[],
    correct_answer  TEXT,
    correct_answers TEXT[],
    correct_order   TEXT[],
    pairs           JSONB,
    min_value       INT,
    max_value       INT,
    correct_range   JSONB,
    unit            TEXT
);
