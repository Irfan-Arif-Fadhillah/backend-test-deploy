-- This script will add users to the database
-- Run this in your PostgreSQL client (like pgAdmin or psql)

-- First, check if the users already exist
DO $$
BEGIN
    -- Add admin user
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES ('admin', crypt('admin123', gen_salt('bf')), 'admin', NOW());
        RAISE NOTICE 'Created admin user';
    ELSE
        UPDATE users 
        SET password_hash = crypt('admin123', gen_salt('bf')), 
            role = 'admin'
        WHERE username = 'admin';
        RAISE NOTICE 'Updated admin user';
    END IF;

    -- Add regular users
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'user1') THEN
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES ('user1', crypt('user123', gen_salt('bf')), 'user', NOW());
        RAISE NOTICE 'Created user1';
    ELSE
        UPDATE users 
        SET password_hash = crypt('user123', gen_salt('bf')), 
            role = 'user'
        WHERE username = 'user1';
        RAISE NOTICE 'Updated user1';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'user2') THEN
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES ('user2', crypt('user123', gen_salt('bf')), 'user', NOW());
        RAISE NOTICE 'Created user2';
    ELSE
        UPDATE users 
        SET password_hash = crypt('user123', gen_salt('bf')), 
            role = 'user'
        WHERE username = 'user2';
        RAISE NOTICE 'Updated user2';
    END IF;
END $$;

-- Verify the users were added
SELECT id, username, role, created_at 
FROM users 
WHERE username IN ('admin', 'user1', 'user2');
