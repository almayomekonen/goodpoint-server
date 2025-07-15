-- Create a simple test user for debugging
-- This creates a user with password: test123

-- 1. Create the test user
INSERT INTO `user` (
    `id`,
    `username`,
    `first_name`,
    `last_name`,
    `password`,
    `type`,
    `created`,
    `updated`,
    `emailVerified`,
    `system_notifications`
) VALUES (
    'test-user-001',
    'test@goodpoint.com',
    'Test',
    'User',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin',
    NOW(),
    NOW(),
    true,
    true
);

-- 2. Get the SUPERADMIN role ID
SET @superadmin_role_id = (SELECT id FROM `role` WHERE `roleKey` = 'SUPERADMIN' LIMIT 1);

-- 3. Assign SUPERADMIN role to the user
INSERT INTO `user_role` (
    `user_id`,
    `role_id`
) VALUES (
    'test-user-001',
    @superadmin_role_id
);

-- 4. Create a school if it doesn't exist
INSERT IGNORE INTO `school` (
    `id`,
    `name`,
    `name_he`,
    `created`,
    `updated`
) VALUES (
    1,
    'Test School',
    'בית ספר בדיקה',
    NOW(),
    NOW()
);

-- 5. Assign user to school
INSERT INTO `user_school` (
    `user_id`,
    `school_id`,
    `role_id`,
    `createdAt`,
    `updatedAt`
) VALUES (
    'test-user-001',
    1,
    @superadmin_role_id,
    NOW(),
    NOW()
);

-- 6. Show the created user
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.type,
    r.roleKey,
    us.school_id
FROM `user` u
LEFT JOIN `user_role` ur ON u.id = ur.user_id
LEFT JOIN `role` r ON ur.role_id = r.id
LEFT JOIN `user_school` us ON u.id = us.user_id
WHERE u.username = 'test@goodpoint.com'; 