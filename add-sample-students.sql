-- Add sample students for testing good points
-- First, get the admin user ID and school ID
SET @admin_user_id = (SELECT id FROM user WHERE username = 'admin@goodpoint.com' LIMIT 1);
SET @school_id = 1;

-- Add sample students
INSERT INTO student (first_name, last_name, gender, school_id, class_id, created, modified) VALUES
('יוסי', 'כהן', 'MALE', @school_id, 1, NOW(), NOW()),
('שרה', 'לוי', 'FEMALE', @school_id, 1, NOW(), NOW()),
('דוד', 'גולדברג', 'MALE', @school_id, 2, NOW(), NOW()),
('מיכל', 'ברק', 'FEMALE', @school_id, 2, NOW(), NOW()),
('אברהם', 'שלום', 'MALE', @school_id, 3, NOW(), NOW());

-- Show the students we added
SELECT 'Sample students added:' as info;
SELECT id, first_name, last_name, gender, class_id 
FROM student 
WHERE school_id = @school_id 
ORDER BY id DESC 
LIMIT 5; 