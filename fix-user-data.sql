-- Fix user data for Firebase user
-- This script will update the user data to match the Firebase user

-- 1. Update the existing user or create a new one with the correct Firebase ID
INSERT INTO `user` (
    `id`,
    `username`,
    `first_name`,
    `last_name`,
    `phone_number`,
    `preferred_language`,
    `system_notifications`,
    `type`,
    `created`,
    `updated`,
    `emailVerified`
) VALUES (
    'xbgQwDueQab1hlZVhznAoec8Qeh2',
    'admin@goodpoint.com',
    'Almayo',
    'Mekonen',
    '+972501234567',
    'he',
    true,
    'admin',
    NOW(),
    NOW(),
    true
) ON DUPLICATE KEY UPDATE
    `first_name` = VALUES(`first_name`),
    `last_name` = VALUES(`last_name`),
    `phone_number` = VALUES(`phone_number`),
    `preferred_language` = VALUES(`preferred_language`),
    `system_notifications` = VALUES(`system_notifications`),
    `updated` = NOW();

-- 2. Get the SUPERADMIN role ID
SET @superadmin_role_id = (SELECT id FROM `role` WHERE `roleKey` = 'SUPERADMIN' LIMIT 1);

-- 3. Assign SUPERADMIN role to the user (if not already assigned)
INSERT IGNORE INTO `user_role` (
    `user_id`,
    `role_id`
) VALUES (
    'xbgQwDueQab1hlZVhznAoec8Qeh2',
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
    'Ort Tel Aviv Elementary School',
    'בית ספר יסודי אורט תל אביב',
    NOW(),
    NOW()
);

-- 5. Assign user to school (if not already assigned)
INSERT IGNORE INTO `user_school` (
    `user_id`,
    `school_id`,
    `role_id`,
    `createdAt`,
    `updatedAt`
) VALUES (
    'xbgQwDueQab1hlZVhznAoec8Qeh2',
    1,
    @superadmin_role_id,
    NOW(),
    NOW()
);

-- 6. Verify the user was created/updated
SELECT 
    u.id,
    u.username,
    u.first_name,
    u.last_name,
    u.phone_number,
    u.preferred_language,
    u.system_notifications,
    u.type,
    r.roleKey,
    us.school_id,
    s.name_he as school_name
FROM `user` u
LEFT JOIN `user_role` ur ON u.id = ur.user_id
LEFT JOIN `role` r ON ur.role_id = r.id
LEFT JOIN `user_school` us ON u.id = us.user_id
LEFT JOIN `school` s ON us.school_id = s.id
WHERE u.username = 'admin@goodpoint.com'; 