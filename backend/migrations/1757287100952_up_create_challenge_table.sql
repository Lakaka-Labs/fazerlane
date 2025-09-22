CREATE TABLE challenges
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position          SERIAL NOT NULL,
    lane              UUID   NOT NULL REFERENCES lanes (id) ON DELETE CASCADE,
    title             TEXT   NOT NULL UNIQUE,
    objective         TEXT   NOT NULL,
    instruction       TEXT   NOT NULL,
    assignment        TEXT   NOT NULL,
    submission_format TEXT[] NOT NULL,
    difficulty        TEXT   NOT NULL
);

CREATE TABLE challenge_references
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge  UUID NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time   TEXT NOT NULL,
    purpose    TEXT NOT NULL
);