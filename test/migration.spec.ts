import * as dotenv from 'dotenv';
import * as mysql from 'promise-mysql';
import * as path from 'path';
/**this should be run after running migrate-prod.sh
 *
 * It compares between the new migrated local database and the old production database to make sure that no data was lost
 *
 */
describe('migration comparison', () => {
    let localConnection: mysql.Connection, oldProdConnection: mysql.Connection;
    beforeAll(async () => {
        dotenv.config({ path: path.join(__dirname, '../.env') });
        localConnection = await mysql.createConnection({
            password: 'z10mz10m',
            user: 'root',
            host: 'localhost',
            database: 'good_point',
        });
        // oldProdConnection
        oldProdConnection = await mysql.createConnection({
            database: process.env.OLD_PROD_DB_NAME,
            host: process.env.OLD_PROD_DB_HOST,
            user: process.env.OLD_PROD_DB_USER,
            password: process.env.OLD_PROD_DB_PASSWORD,
            port: 3306,
            ssl: {},
        });
    });

    it('comparing user count', async () => {
        const newUsers = (await localConnection.query('SELECT COUNT(*) as count from user'))[0].count;
        const oldUsers = (await oldProdConnection.query('SELECT COUNT(*) as count from CustomUser'))[0].count;

        //NOTE: some users were supposed to get deleted from the old db when migrating to the new one
        //So lets check that not To Many users were deleted
        console.log('new users count is ', newUsers);
        console.log('old user count is ', oldUsers);
        const ratio = newUsers / oldUsers;
        expect(ratio).toBeGreaterThan(0.95);
    });

    afterAll(async () => {
        localConnection && (await localConnection.end());
        oldProdConnection && (await oldProdConnection.end());
    });
});
