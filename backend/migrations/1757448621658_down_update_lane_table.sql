ALTER TABLE lanes
    DROP CONSTRAINT lanes_state_check;

ALTER TABLE lanes
    ADD CONSTRAINT lanes_state_check
        CHECK (state IN ('processing', 'created', 'failed'));

ALTER TABLE lanes
    ALTER COLUMN state SET DEFAULT 'processing';

UPDATE lanes
SET state = CASE
                WHEN state IN ('accepted', 'context-analysed', 'milestone-generated')
                    THEN 'processing'
                WHEN state = 'completed' THEN 'created'
                WHEN state = 'failed' THEN 'failed'
                ELSE 'processing'
    END;