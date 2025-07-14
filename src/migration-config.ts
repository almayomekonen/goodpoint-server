import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
dotenv.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV ?? 'development'}`) });
const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'z10mz10',
    database: process.env.DB_NAME || 'good_point',
    entities: ['node_modules/@hilma/auth-nest/dist/**/*.entity{.ts,.js}', 'dist/entities/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
});

dataSource.initialize();

export default dataSource;
