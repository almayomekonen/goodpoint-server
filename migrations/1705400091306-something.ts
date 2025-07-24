import { MigrationInterface, QueryRunner } from 'typeorm';
/**An example of a migration ,
 *  to Activate run npm run migration-run
 * to revert run npm run migration-revert
 */
export class Something1705400091306 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const users = await queryRunner.query('SELECT * FROM user');
        console.log('all users are ', users);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const usersCount = await queryRunner.query('SELECT COUNT(*) from user');
        console.log('user count is ', usersCount);
    }
}
