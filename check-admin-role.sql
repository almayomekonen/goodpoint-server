-- Check admin user's current roles
SELECT u.username, u.id, r.name as role_name
FROM user u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role r ON ur.role_id = r.id
WHERE u.username = 'admin@goodpoint.com';

-- Add TEACHER role to admin user if missing
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM user u, role r
WHERE u.username = 'admin@goodpoint.com' 
AND r.name = 'TEACHER';

-- Show updated roles
SELECT u.username, u.id, r.name as role_name
FROM user u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN role r ON ur.role_id = r.id
WHERE u.username = 'admin@goodpoint.com'; 