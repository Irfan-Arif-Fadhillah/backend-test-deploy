-- Script untuk membuat user admin dan user biasa
-- Jalankan di pgAdmin atau psql sebagai superuser (postgres)

-- Pastikan extension pgcrypto tersedia (untuk crypt function)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Buat atau update user ADMIN
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE username = 'admin') THEN
        -- Update existing admin
        UPDATE users 
        SET password_hash = crypt('admin123', gen_salt('bf')),
            role = 'admin'
        WHERE username = 'admin';
        RAISE NOTICE 'Admin user updated';
    ELSE
        -- Create new admin
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES ('admin', crypt('admin123', gen_salt('bf')), 'admin', NOW());
        RAISE NOTICE 'Admin user created';
    END IF;
END $$;

-- Buat atau update user USER (read-only)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE username = 'user') THEN
        -- Update existing user
        UPDATE users 
        SET password_hash = crypt('user123', gen_salt('bf')),
            role = 'user'
        WHERE username = 'user';
        RAISE NOTICE 'User updated';
    ELSE
        -- Create new user
        INSERT INTO users (username, password_hash, role, created_at)
        VALUES ('user', crypt('user123', gen_salt('bf')), 'user', NOW());
        RAISE NOTICE 'User created';
    END IF;
END $$;

-- Tampilkan hasil
SELECT 
    id,
    username,
    role,
    created_at
FROM users 
WHERE username IN ('admin', 'user')
ORDER BY role DESC, username;

-- Informasi kredensial
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '📋 USER CREDENTIALS:';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '👑 ADMIN (Full Access - CRUD):';
    RAISE NOTICE '   Username: admin';
    RAISE NOTICE '   Password: admin123';
    RAISE NOTICE '   Access:   Create, Read, Update, Delete semua data';
    RAISE NOTICE '';
    RAISE NOTICE '👤 USER (Read-Only):';
    RAISE NOTICE '   Username: user';
    RAISE NOTICE '   Password: user123';
    RAISE NOTICE '   Access:   Hanya melihat data (Read-Only)';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;

