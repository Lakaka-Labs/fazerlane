CREATE TABLE IF NOT EXISTS challenge_attempts
(
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    challenge_id    UUID REFERENCES challenges (id) ON DELETE CASCADE ON UPDATE CASCADE,
    feedback   TEXT  NOT NULL,
    pass       BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)