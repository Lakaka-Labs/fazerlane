CREATE TABLE youtubes
(
    id       TEXT PRIMARY KEY,
    title    TEXT NOT NULL,
    duration INT  NOT NULL
);

CREATE TABLE lanes
(
    id                  UUID PRIMARY KEY                                                   DEFAULT uuid_generate_v4(),
    creator             UUID NOT NULL REFERENCES users (id) ON UPDATE CASCADE,
    state               TEXT NOT NULL CHECK (state IN ('accepted', 'completed', 'failed')) DEFAULT 'accepted',
    youtube             TEXT NOT NULL REFERENCES youtubes (id) ON UPDATE CASCADE,
    challenge_generated BOOLEAN                                                            DEFAULT false,
    created_at          TIMESTAMPTZ                                                        DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ                                                        DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trigger_resource_analysis_updated_at
    BEFORE UPDATE
    ON lanes
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();