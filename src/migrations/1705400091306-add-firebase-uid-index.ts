import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirebaseUidIndex1705400091306 implements MigrationInterface {
    name = 'AddFirebaseUidIndex1705400091306';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add index on firebase_uid column for better performance
        await queryRunner.query(`
            CREATE INDEX idx_user_firebase_uid ON user (firebase_uid)
        `);

        // Add unique constraint to prevent duplicate Firebase UIDs
        await queryRunner.query(`
            ALTER TABLE user ADD CONSTRAINT uk_user_firebase_uid UNIQUE (firebase_uid)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove unique constraint
        await queryRunner.query(`
            ALTER TABLE user DROP CONSTRAINT uk_user_firebase_uid
        `);

        // Remove index
        await queryRunner.query(`
            DROP INDEX idx_user_firebase_uid ON user
        `);
    }
}
