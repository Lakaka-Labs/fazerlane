DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

-- Only after all dependent triggers are gone, can you drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS users;