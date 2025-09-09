ALTER TABLE lanes
    DROP CONSTRAINT IF EXISTS lanes_state_check;

ALTER TABLE lanes
    ADD CONSTRAINT lanes_state_check
        CHECK (state IN ('accepted', 'context-analysed', 'milestone-generated', 'completed', 'failed'));

ALTER TABLE lanes
    ALTER COLUMN state SET DEFAULT 'accepted';

UPDATE lanes
SET state = CASE
                WHEN state = 'processing' THEN 'accepted'
                WHEN state = 'created' THEN 'completed'
                WHEN state = 'failed' THEN 'failed'
                ELSE 'accepted'
    END;
