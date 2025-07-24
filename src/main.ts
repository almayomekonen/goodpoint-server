import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import './console-log-obj';

// Load environment variables based on NODE_ENV
import { config } from 'dotenv';

// Only load .env files in development - Railway provides env vars directly
if (process.env.NODE_ENV !== 'production') {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
    console.log('Loading environment from:', envFile);
    config({ path: envFile });
} else {
    console.log('Production mode: Using Railway environment variables');
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configure CORS for production
    const corsOptions = {
        origin:
            process.env.NODE_ENV === 'production'
                ? ['https://goodpoint-client.vercel.app', process.env.CLIENT_DOMAIN]
                : true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    };

    app.enableCors(corsOptions);
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

    // ✅ CRITICAL FIX: Add '0.0.0.0' host parameter
    await app.listen(port, '0.0.0.0');

    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    console.log(`🏥 Health check: http://0.0.0.0:${port}/api/health`);
}
bootstrap();
