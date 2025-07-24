//eslint-disable-next-line
const mysql = require('promise-mysql');
//eslint-disable-next-line
const [, , local_db_user, local_db_password, local_db_name] = process.argv;

const startUp = async () => {
    const con = await mysql.createConnection({
        host: 'localhost',
        user: local_db_user || 'root',
        password: local_db_password || 'z10mz10m',
        database: local_db_name || 'good_point',
    });

    //dropping unnecessary  tables(CustomUser still needs to be deleted afterwards)
    const tablesToDrop = [
        'games',
        'ACL',
        'AccessToken',
        'Image',
        'User',
        'acl',
        'RoleMapping',
        'stop',
        'notificationsmap',
        'NotificationsMap',
        'notification',
        'records_permissions',
        'reset_password',
        'Notification',
        'Role',
        'accesstoken',
        'user',
    ];

    await Promise.all(
        tablesToDrop.map((table) => {
            con.query(`DROP TABLE IF EXISTS ${table}`, (error) => {
                if (error) throw error;
            });
        }),
    );
    console.log('dropped tables');
    const columnsToDropFromUser = [
        'loginAccess',
        'school',
        'student_class_index',
        'student_class',
        'zehut',
        'school_code',
        'mainImageId',
        'verificationToken',
        'emailVerified',
        'credentials',
        'realm',
        'username',
    ];

    await con.query(`ALTER TABLE access_logger 
  DROP COLUMN email,
  CHANGE COLUMN created date DATETIME NULL DEFAULT NULL;`);

    await con.query(`ALTER TABLE students 
  DROP COLUMN school_code;`);

    await con.query(`ALTER TABLE customuser 
  RENAME TO user;`);

    await Promise.all(
        columnsToDropFromUser.map((column) => {
            con.query(`ALTER TABLE user DROP COLUMN ${column}`);
        }),
    );

    //email is now username
    await con.query(`ALTER TABLE user CHANGE COLUMN email username VARCHAR(255) NOT NULL;`);

    await con.query(`CREATE TABLE ids(
    old_id INT NOT NULL,
    new_id VARCHAR(36) NULL,
    PRIMARY KEY(old_id));`);

    await con.query(` INSERT INTO ids(old_id)  SELECT id FROM user;`);

    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`UPDATE ids SET new_id = UUID();`);
    await con.query(` SET sql_safe_updates = 1;`);

    // looping over the old_ids
    const tablesWithOldUserId = [
        'good_points',
        'user_school',
        'classes',
        'preset_messages',
        'removed_preset_messages',
        'archived_good_points',
        'rolemapping',
    ];

    await Promise.all(
        tablesWithOldUserId.map(async (table) => {
            //for each table , we create a new column of new_id
            await con.query(`ALTER TABLE ${table} ADD COLUMN new_user_id VARCHAR(36) NULL`);

            const columns = await con.query(`desc ${table}; `);
            let keyword;
            // console.log(columns);
            columns.forEach((column) => {
                const field = column.Field;
                if (field === 'user_id') keyword = 'user_id';
                else if (field === 'teacher_id') keyword = 'teacher_id';
                else if (field === 'userId') keyword = 'userId';
                else if (field === 'creator_id') keyword = 'creator_id';
                else if (field === 'principalId') keyword = 'principalId';
                else return;
            });
            if (!keyword) return;
            // console.log(keyword);
            await con.query(`SET sql_safe_updates = 0;`);

            await con.query(
                `UPDATE ${table} JOIN ids ON ids.old_id = ${table}.${keyword} SET ${table}.new_user_id=ids.new_id;`,
            );
            await con.query(`SET sql_safe_updates = 1;`);
        }),
    );

    await con.query(`ALTER TABLE user ADD COLUMN new_user_id VARCHAR(36) NULL;`);
    await con.query(`SET sql_safe_updates = 0;`);
    // UPDATE user JOIN ids ON ids.old_id =user.id SET new_user_id =ids.new_id;
    await con.query(`UPDATE user JOIN ids ON ids.old_id =user.id SET user.new_user_id=ids.new_id;`);

    await con.query(`SET sql_safe_updates = 1;`);

    //1)remove the old user_id column
    //2) rename the new id column
    //3) after all of the tables have been modified , recreate the relationships(hopefully works)

    /*----------------------------working on user_school table ------------------------------------------------------- */

    //removing rows with users that don't exist
    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`DELETE FROM user_school WHERE new_user_id IS NULL;`);
    await con.query(`SET sql_safe_updates = 1;`);

    //adding new id as primary
    await con.query(
        `ALTER TABLE user_school CHANGE COLUMN new_user_id new_user_id VARCHAR(36) NOT NULL , DROP PRIMARY KEY , ADD PRIMARY KEY (user_id,school_id,new_user_id);`,
    );
    //removing old column
    await con.query(`ALTER TABLE user_school DROP FOREIGN KEY user_school_ibfk_1;`);
    await con.query(
        `ALTER TABLE user_school DROP COLUMN user_id, DROP PRIMARY KEY , ADD PRIMARY KEY(school_id,new_user_id);`,
    );

    //renaming new column
    await con.query(`ALTER TABLE user_school CHANGE COLUMN new_user_id user_id VARCHAR(36) NOT NULL;`);
    /*-------------------------------------------------------------------------------------------------------------------------------- */

    /*---------------------------------------working on classes table---------------------------------------------- */

    await con.query(`ALTER TABLE classes DROP COLUMN teacher_id;`);
    await con.query(`ALTER TABLE classes CHANGE COLUMN new_user_id teacher_id VARCHAR(36) NULL DEFAULT NULL;`);
    await con.query(`ALTER TABLE classes CHANGE COLUMN school_id school_id INT UNSIGNED NULL;`);
    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`UPDATE classes SET school_id= NULL WHERE school_id=0;`);
    await con.query(`SET sql_safe_updates = 1;`);
    /*------------------------------------------------------------------------------------------------------------------ */

    /*------------------------------------------working on good_points table----------------------------------------------------- */
    await con.query(`ALTER TABLE good_points DROP COLUMN teacher_id;`);
    await con.query(`ALTER TABLE good_points CHANGE COLUMN new_user_id teacher_id VARCHAR(36) NULL DEFAULT NULL;`);
    await con.query(`ALTER TABLE good_points CHANGE COLUMN school_id school_id INT UNSIGNED NULL;`);

    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`UPDATE good_points SET school_id= NULL WHERE school_id=0;`);
    await con.query(`SET sql_safe_updates = 1;`);
    /*-------------------------------------------------------------------------------------------------------------------------------- */

    /* ---------------------------------------working on preset_messages table---------------------------------*/
    await con.query(`ALTER TABLE preset_messages DROP COLUMN creator_id;`);
    await con.query(`ALTER TABLE preset_messages CHANGE COLUMN new_user_id creator_id VARCHAR(36) NULL DEFAULT NULL;`);
    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`UPDATE preset_messages SET school_id= NULL WHERE school_id=0;`);
    await con.query(`SET sql_safe_updates = 1;`);
    /*----------------------------------------------------------------------------- ----------------------------------------------------*/

    /* ---------------------------------------working on removed_preset_messages table---------------------------------*/
    await con.query(`ALTER TABLE removed_preset_messages DROP COLUMN teacher_id;`);

    await con.query(
        `ALTER TABLE removed_preset_messages CHANGE COLUMN new_user_id teacher_id VARCHAR(36) NULL DEFAULT NULL;`,
    );

    /*----------------------------------------------------------------------------- ----------------------------------------------------*/

    /* ---------------------------------------working on archived_good_points table---------------------------------*/
    await con.query(`ALTER TABLE archived_good_points DROP COLUMN teacher_id;`);
    await con.query(
        `ALTER TABLE archived_good_points CHANGE COLUMN new_user_id teacher_id VARCHAR(36) NULL DEFAULT NULL;`,
    );

    await con.query(`ALTER TABLE archived_good_points CHANGE COLUMN school_id school_id INT UNSIGNED NULL;`);
    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`UPDATE archived_good_points SET school_id= NULL WHERE school_id=0;`);
    await con.query(`SET sql_safe_updates = 1;`);

    /*----------------------------------------------------------------------------- ----------------------------------------------------*/

    /* ---------------------------------------working on rolemapping table---------------------------------*/
    await con.query(`ALTER TABLE rolemapping DROP COLUMN principalId;`);
    await con.query(
        `ALTER TABLE rolemapping CHANGE COLUMN new_user_id user_id VARCHAR(36) NULL DEFAULT NULL, CHANGE COLUMN roleId role_id INT NULL DEFAULT NULL;`,
    );
    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(`DELETE FROM rolemapping WHERE user_id IS NULL;`);
    await con.query(`SET sql_safe_updates = 1;`);

    await con.query(
        `ALTER TABLE rolemapping DROP COLUMN principalType, DROP COLUMN id , CHANGE COLUMN role_id role_id INT NOT NULL , CHANGE COLUMN user_id user_id VARCHAR(36) NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (role_id,user_id);`,
    );

    //TODO:add the roles to the user_school table
    await con.query(`ALTER TABLE rolemapping RENAME TO user_role;`);
    /*----------------------------------------------------------------------------- ----------------------------------------------------*/

    /*------------------------------------------working on user table --------------------------------------------------------------------- */

    await con.query(
        `ALTER TABLE user CHANGE COLUMN new_user_id new_user_id VARCHAR(36) NOT NULL , DROP PRIMARY KEY , ADD PRIMARY KEY(id,new_user_id);`,
    );
    await con.query(`ALTER TABLE user DROP COLUMN id , DROP PRIMARY KEY , ADD PRIMARY KEY (new_user_id);`);

    await con.query(`ALTER TABLE user CHANGE COLUMN new_user_id id VARCHAR(36) NOT NULL;`);
    const duplicateUsers = await con.query(`SELECT * FROM user where username= "gp.hilma.170514@gmail.com";`);
    await con.query(`ALTER TABLE user CHANGE COLUMN password password VARCHAR(255) NULL DEFAULT NULL;`);
    await Promise.all(
        duplicateUsers.map(async (user) => {
            const school = await con.query(`SELECT * FROM user_school where user_id="${user.id}";`);

            if (school[0].school_id == 23) {
                //the one needed to be removed
                await con.query(`DELETE FROM user where id="${user.id}";`);
                await con.query(`SET sql_safe_updates = 0;`);
                await con.query(`DELETE FROM user_role WHERE user_id="${user.id}";`);
                await con.query(`SET sql_safe_updates = 1;`);
                console.log('deleted duplicate user');
            }
        }),
    );

    //creating the user_password table
    await con.query(
        `CREATE TABLE user_password (id INT NOT NULL AUTO_INCREMENT , password VARCHAR(255) NOT NULL ,userId VARCHAR(36) NULL, PRIMARY KEY (id));`,
    );
    //moving all the passwords to that table
    await con.query(`INSERT INTO user_password (password,userId) SELECT password,id FROM user;`);

    /*----------------------------------------------------------------------------------------------------------------------------------------- */

    //now assuming we finished modifying all tables , we recreate the relationships
    //apparently there is no need to define relationships
    await con.query(`ALTER TABLE user CONVERT TO CHARACTER SET utf8mb4;`); //preventing mismatches between tables
    await con.query(`ALTER TABLE user_school CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE classes CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE preset_messages CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE good_points CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE removed_preset_messages CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE archived_good_points CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE access_logger CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE students CONVERT TO CHARACTER SET utf8mb4;`);
    await con.query(`ALTER TABLE user_role CONVERT TO CHARACTER SET utf8mb4;`);

    //extra stuff

    await con.query(`ALTER TABLE archived_good_points CHANGE COLUMN student_id student_id INT NULL;`);

    await con.query(`SET sql_safe_updates = 0;`);

    const archived_good_points = await con.query(`SELECT student_id,teacher_id FROM archived_good_points;`);
    await Promise.all(
        archived_good_points.map(async (arc) => {
            if (arc.student_id) {
                const relatedStudent = await con.query(`SELECT * FROM students where id=${arc.student_id};`);
                if (relatedStudent.length === 0) {
                    await con.query(
                        `UPDATE archived_good_points SET student_id=NULL where student_id =${arc.student_id}; `,
                    );
                    // console.log('deleted');
                }
            }
            if (!arc.teacher_id) return;
            const relatedUser = await con.query(`SELECT * FROM user WHERE id="${arc.teacher_id}";`);

            if (relatedUser.length === 0) {
                await con.query(
                    `UPDATE archived_good_points SET teacher_id =NULL WHERE teacher_id="${arc.teacher_id}";`,
                );
                // console.log('deleted teacher reference');
            }
        }),
    );

    await con.query(`DELETE us FROM user_school us LEFT JOIN user u  ON us.user_id=u.id where first_name IS NULL;`);

    await con.query(`SET sql_safe_updates = 1;`);

    //modifying role table

    await con.query(
        `ALTER TABLE role CHANGE COLUMN name name VARCHAR(20) NOT NULL, CHANGE COLUMN description description VARCHAR(255) NULL , CHANGE COLUMN roleKey roleKey VARCHAR(255) NULL; `,
    );
    await con.query(`UPDATE role SET description ="teacher" WHERE id=1;`);
    await con.query(`UPDATE role SET description ="school principal" WHERE id=2;`);
    await con.query(`UPDATE role SET description ="Hilma admin"  WHERE id=3;`);

    //removing non existing preset_messages from removed_preset_messages
    const removed_preset_messages_ids = await con.query(
        `SELECT removed_preset_messages.id   FROM removed_preset_messages LEFT JOIN preset_messages ON preset_message_id=preset_messages.id WHERE preset_messages.id IS NULL ;  `,
    );

    // console.log('before removed_preset_messages');
    await con.query(`SET sql_safe_updates = 0;`);
    await Promise.all(
        removed_preset_messages_ids.map((idObj) => {
            con.query(`DELETE FROM removed_preset_messages WHERE id=${idObj.id};`);
        }),
    );
    //changing type of users to staff
    await con.query(`ALTER TABLE user ADD COLUMN type VARCHAR(255)  DEFAULT NULL`);
    await con.query(`UPDATE user SET type='staff';`);
    await con.query(`SET sql_safe_updates = 1;`);

    //changing SIMPLEUSER to TEACHER
    await con.query('UPDATE role SET name="TEACHER" WHERE id=1;');

    await con.query(`SET sql_safe_updates = 0;`);
    await con.query(
        'UPDATE students left join classes on class_id=classes.id LEFT JOIN school ON classes.school_id=school.id SET students.school_id = classes.school_id',
    );
    await con.query(`UPDATE students SET school_id= NULL WHERE school_id=0;`);
    await con.query(`SET sql_safe_updates = 1;`);

    //typeorm deleted this immediately for some reason
    // await con.query(`ALTER TABLE user_password ADD CONSTRAINT FK_3e755bee2cdcee50a9e742776d8 FOREIGN KEY(userID) REFERENCES user(id) ON DELETE CASCADE`)
    await con.query('DROP TABLE ids');
    //   await con.query('DROP TABLE games')
    await con.query('DROP TABLE image');

    //1.delete users that don't have a role
    //2.add role column to user_school
    //3.update the roles

    //find users that don't have a role
    const roleLessUsers = `SELECT us.id FROM user AS us  LEFT JOIN user_role ON us.id=user_role.user_id where role_id IS NULL`;
    await con.query(`SET sql_safe_updates = 0;`);

    //delete all related stuff
    await con.query(`DELETE FROM user_password WHERE userId IN (${roleLessUsers})`);
    await con.query(`DELETE FROM user_school WHERE user_id IN (${roleLessUsers})`);
    await con.query(`DELETE FROM classes WHERE teacher_id IN (${roleLessUsers})`);
    // await con.query(`DELETE FROM user WHERE user.id IN (${roleLessUsers})`)
    await con.query(`DELETE user FROM user LEFT JOIN user_role ON user.id=user_role.user_Id WHERE role_id IS NULL`);
    await con.query(`ALTER TABLE user_school ADD COLUMN role_id int NOT NULL`);
    await con.query(
        'UPDATE user_school INNER JOIN user ON user.id=user_school.user_id INNER JOIN user_role ON user_role.user_id=user.id SET user_school.role_id=user_role.role_id',
    );

    //26.6.2023 additional changes
    //delete sms that doesn't connect to any school
    await con.query(`DELETE s FROM sms s LEFT JOIN school h ON s.schoolId=h.id WHERE name IS NULL;`);

    //11/7/2023 additional changes

    /**
     * adding parent_phone table and moving all existing numbers there
     *
     */
    //creating the table with a student id and a phone number , the student id is primary key
    await con.query(`
    CREATE TABLE parent_phone
    ( student_id int NOT NULL,
        phone varchar(14) NOT NULL,
        PRIMARY KEY (student_id) ); `);
    //adding current phone numbers to this table
    //in the students table  , phone number 3 is the personal phone number

    //add phone_number column to students table
    await con.query(`
    ALTER TABLE students ADD COLUMN phone_number VARCHAR(14) NULL;
    `);
    //update phone_number to be what  phone_number_3 was
    await con.query(`
    UPDATE students SET phone_number=phone_number_3 
        WHERE phone_number_3 IS NOT NULL 
        AND phone_number_3 !='';
    `);

    //first we add the personal phone numbers
    await con.query(`
        INSERT IGNORE INTO parent_phone 
        (phone,student_id)
        SELECT phone_number_1,id FROM students WHERE phone_number_1 IS NOT NULL AND phone_number_1 !='';
    `);

    //then we add the rest of the phone numbers
    await con.query(`
    INSERT IGNORE INTO parent_phone 
    (phone,student_id)
    SELECT phone_number_2,id FROM students WHERE phone_number_2 IS NOT NULL AND phone_number_2 !='';
    `);

    //make admin a super admin instead of a teacher

    await con.query(
        `UPDATE user_role INNER JOIN user ON user_id=user.id SET role_id =3 WHERE username ='admin@carmel6000.amitnet.org';`,
    );

    await con.query(`SET sql_safe_updates = 1;`);
    console.log('finished tables setup');
    await con.end();
};
startUp();
