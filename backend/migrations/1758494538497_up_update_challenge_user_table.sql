ALTER TABLE challenge_users
    ADD CONSTRAINT unique_user_challenge
        UNIQUE (user_id, challenge_id);
