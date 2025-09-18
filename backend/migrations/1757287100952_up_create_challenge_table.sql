CREATE TABLE challenges
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lane              UUID   NOT NULL REFERENCES lanes (id) ON DELETE CASCADE,
    title             TEXT   NOT NULL UNIQUE,
    objective         TEXT   NOT NULL,
    instruction       TEXT   NOT NULL,
    assignment        TEXT   NOT NULL,
    submission_format TEXT   NOT NULL CHECK (submission_format IN ('video', 'image', 'audio', 'text', 'code')),
    success_criteria  TEXT   NOT NULL,
    position          SERIAL NOT NULL
);

CREATE TABLE challenge_references
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge  UUID NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time   TEXT NOT NULL,
    purpose    TEXT NOT NULL
);