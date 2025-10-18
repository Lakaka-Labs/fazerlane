CREATE TABLE conversations
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    lane_id    UUID NOT NULL REFERENCES lanes (id) ON UPDATE CASCADE,
    title      TEXT,
    generating BOOLEAN          DEFAULT false,
    created_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_conversations_updated_at
    BEFORE UPDATE
    ON conversations
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE messages
(
    id              UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    conversation_id UUID        NOT NULL REFERENCES conversations (id) ON DELETE CASCADE ON UPDATE CASCADE,
    role            VARCHAR(31) NOT NULL CHECK (role IN ('user', 'model')),
    content         TEXT        NOT NULL,
    token           INT         NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ          DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ          DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trigger_messages_updated_at
    BEFORE UPDATE
    ON messages
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();