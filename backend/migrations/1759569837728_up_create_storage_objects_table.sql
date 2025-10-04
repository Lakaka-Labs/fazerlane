CREATE TABLE storage_objects
(
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    public_url    TEXT NOT NULL,
    llm_url       TEXT,
    mime_type     TEXT NOT NULL,
    user_id       UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at    TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);