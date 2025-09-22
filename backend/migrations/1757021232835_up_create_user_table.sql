CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users
(
    id             UUID PRIMARY KEY             DEFAULT uuid_generate_v4(),
    email          VARCHAR(255) UNIQUE NOT NULL,
    password       TEXT,
    google_id      VARCHAR(255),
    username       VARCHAR(255) UNIQUE,
    email_verified BOOLEAN             NOT NULL DEFAULT false,
    xp             INTEGER                      default 0,
    streak         INTEGER                      default 0,
    created_at     TIMESTAMPTZ                  DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ                  DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);


CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE
    ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();