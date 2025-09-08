CREATE TABLE resource_segments
(
    id                  SERIAL PRIMARY KEY,
    youtube     TEXT NOT NULL
        REFERENCES youtubes (id) ON DELETE CASCADE,
    start_time          VARCHAR(31) NOT NULL,
    end_time            VARCHAR(31) NOT NULL,
    title               TEXT        NOT NULL,
    summary             TEXT        NOT NULL,
    learning_objectives TEXT[]      NOT NULL,
    visual_elements     TEXT[]      NOT NULL,
    transcription       TEXT        NOT NULL
);