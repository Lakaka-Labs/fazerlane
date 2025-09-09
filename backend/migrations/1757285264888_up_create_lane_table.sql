CREATE TABLE lanes
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator    UUID NOT NULL
        REFERENCES users (id) ON UPDATE CASCADE,
    name       TEXT NOT NULL,
    state      TEXT NOT NULL CHECK (state IN ('processing', 'created', 'failed')) DEFAULT 'processing',
    youtubes   TEXT[],
    goal       TEXT,
    schedule   TEXT,
    experience TEXT,
    created_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE youtubes
(
    id        TEXT PRIMARY KEY,
    title     TEXT NOT NULL,
    duration  INT  NOT NULL,
    segmented BOOLEAN DEFAULT false
);

CREATE TRIGGER trigger_resource_analysis_updated_at
    BEFORE UPDATE
    ON lanes
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();