CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE challenges
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    position          INTEGER NOT NULL,
    lane              UUID    NOT NULL REFERENCES lanes (id) ON DELETE CASCADE,
    title             TEXT    NOT NULL UNIQUE,
    objective         TEXT    NOT NULL,
    instruction       TEXT    NOT NULL,
    assignment        TEXT    NOT NULL,
    submission_format TEXT[]  NOT NULL,
    difficulty        TEXT    NOT NULL,
    embedding         vector(768)
);

CREATE TABLE challenge_references
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge  UUID NOT NULL REFERENCES challenges (id) ON DELETE CASCADE,
    start_time TEXT NOT NULL,
    end_time   TEXT NOT NULL,
    purpose    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS challenges_embedding_idx
    ON challenges USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100)
