CREATE TABLE progresses
(
    id         SERIAL PRIMARY KEY,
    lane       UUID NOT NULL
        REFERENCES lanes (id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    type       TEXT NOT NULL CHECK (type IN ('success', 'fail', 'info')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);