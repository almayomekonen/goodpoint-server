-- Add sample data for admin user
-- This script adds starred classes and preset messages for admin@goodpoint.com

-- First, let's get the admin user ID
SET @admin_user_id = (SELECT id FROM user WHERE username = 'admin@goodpoint.com' LIMIT 1);

-- Add some starred classes for the admin user
INSERT INTO user_starred_classes (user_id, class_id, created_at, updated_at) VALUES
(@admin_user_id, 1, NOW(), NOW()),  -- Grade 1, Class 1
(@admin_user_id, 2, NOW(), NOW()),  -- Grade 1, Class 2
(@admin_user_id, 3, NOW(), NOW()),  -- Grade 2, Class 1
(@admin_user_id, 4, NOW(), NOW()),  -- Grade 2, Class 2
(@admin_user_id, 5, NOW(), NOW());  -- Grade 9, Class 1

-- Add some starred study groups for the admin user
INSERT INTO user_starred_study_groups (user_id, study_group_id, created_at, updated_at) VALUES
(@admin_user_id, 1, NOW(), NOW()),  -- קבוצת לימוד מתמטיקה א
(@admin_user_id, 2, NOW(), NOW()),  -- קבוצת לימוד עברית א
(@admin_user_id, 3, NOW(), NOW());  -- קבוצת לימוד מדעים ב

-- Add some personal preset messages for the admin user
INSERT INTO preset_messages (text, preset_category, creator_id, gender, lang, school_id, created, modified) VALUES
('התלמיד עשה עבודה מצוינת היום!', 'educational', @admin_user_id, 'MALE', 'he', 1, NOW(), NOW()),
('התלמידה השתתפה באופן פעיל בשיעור', 'educational', @admin_user_id, 'FEMALE', 'he', 1, NOW(), NOW()),
('התלמיד עזר לחבריו בצורה יפה', 'social', @admin_user_id, 'MALE', 'he', 1, NOW(), NOW()),
('התלמידה הראתה התחשבות רבה', 'emotional', @admin_user_id, 'FEMALE', 'he', 1, NOW(), NOW()),
('התלמיד הגיע בזמן לכל השיעורים', 'other', @admin_user_id, 'MALE', 'he', 1, NOW(), NOW());

-- Update admin user's preferred language if it's null
UPDATE user SET preferred_language = 'he' WHERE username = 'admin@goodpoint.com' AND preferred_language IS NULL;

-- Update staff table with admin user details if missing
INSERT INTO staff (id, first_name, last_name, phone_number, preferred_language, system_notifications, created, modified)
SELECT @admin_user_id, 'Almayo', 'Mekonen', '+972501234567', 'he', 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM staff WHERE id = @admin_user_id);

-- Show what we added
SELECT 'Admin user starred classes:' as info;
SELECT c.grade, c.class_index, c.id as class_id 
FROM user_starred_classes usc 
JOIN classes c ON usc.class_id = c.id 
WHERE usc.user_id = @admin_user_id;

SELECT 'Admin user starred study groups:' as info;
SELECT sg.name, sg.id as study_group_id 
FROM user_starred_study_groups ussg 
JOIN study_group sg ON ussg.study_group_id = sg.id 
WHERE ussg.user_id = @admin_user_id;

SELECT 'Admin user preset messages:' as info;
SELECT text, preset_category, gender 
FROM preset_messages 
WHERE creator_id = @admin_user_id; 