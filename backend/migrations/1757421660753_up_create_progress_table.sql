CREATE TABLE progresses
(
    id         SERIAL PRIMARY KEY,
    lane       UUID NOT NULL
        REFERENCES lanes (id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    type       TEXT NOT NULL CHECK (type IN ('success', 'fail', 'info')),
    stage      TEXT NOT NULL CHECK (stage IN ('analysis', 'milestone_generation', 'challenge_generation')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);