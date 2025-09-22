CREATE TABLE IF NOT EXISTS challenge_users
(
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    challenge_id UUID REFERENCES challenges (id) ON DELETE CASCADE ON UPDATE CASCADE
)