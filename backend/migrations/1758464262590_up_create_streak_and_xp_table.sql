CREATE TABLE streaks
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE xps
(
    id          UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    user_id     UUID     NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    amount      INTEGER     NOT NULL,
    transaction_type        VARCHAR(50) NOT NULL, -- 'earned', 'bonus', 'penalty', 'quest_completion', etc.
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
