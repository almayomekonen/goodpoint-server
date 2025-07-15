import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import './console-log-obj';

// Load environment variables based on NODE_ENV
import { config } from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env' : `.env.${process.env.NODE_ENV || 'development'}`;

console.log('Loading environment from:', envFile);
config({ path: envFile });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({});
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());

    if (process.env.NODE_ENV !== 'production') {
        const { apiDocsMiddleware } = await import('./common/middleware/apiDocs.middleware');
        const { bootstrapSwagger } = await import('./lib/swagger/bootstrapSwagger');
        apiDocsMiddleware(app);
        await bootstrapSwagger(app);
    }

    const port = process.env.PORT || 8080;
    console.log('Starting server on port:', port);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database host:', process.env.DB_HOST);
    console.log('Access token name:', process.env.ACCESS_TOKEN_NAME);
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
