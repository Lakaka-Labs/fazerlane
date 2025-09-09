CREATE TABLE milestones
(
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lane     UUID NOT NULL
        REFERENCES lanes (id) ON DELETE CASCADE,
    milestone_goal            TEXT   NOT NULL,
    description           TEXT   NOT NULL,
    estimated_duration    TEXT   NOT NULL,
    recommended_resources UUID[] NOT NULL
);