-- Create Admin User for Production
-- Run this script in your Railway production database

-- 1. Create the admin user
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
    'admin-prod-001',
    'admin@goodpoint.com',
    'מנהל',
    'מערכת',
    '$2b$10$1aMmaRuyVzeCQ0N9orS19OjEsq4.mRVRHFCx5I3.xlvMpej9776T.',
    'admin',
    NOW(),
    NOW(),
    true,
    true
);

-- 2. Get the SUPERADMIN role ID (assuming it exists)
-- If this fails, you may need to create the role first
SET @superadmin_role_id = (SELECT id FROM `role` WHERE `roleKey` = 'SUPERADMIN' LIMIT 1);

-- 3. Assign SUPERADMIN role to the user
INSERT INTO `user_role` (
    `user_id`,
    `role_id`
) VALUES (
    'admin-prod-001',
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
    'Default School',
    'בית ספר ברירת מחדל',
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
    'admin-prod-001',
    1,
    @superadmin_role_id,
    NOW(),
    NOW()
);

-- 6. Verify the user was created
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
WHERE u.username = 'admin@goodpoint.com'; 