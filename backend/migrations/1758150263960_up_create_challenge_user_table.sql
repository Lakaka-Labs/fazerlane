CREATE TABLE IF NOT EXISTS challenge_users
(
    user_id      UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE ,
    challenge_id UUID REFERENCES challenges (id) ON DELETE CASCADE ON UPDATE CASCADE ,
    PRIMARY KEY (user_id, challenge_id)
)