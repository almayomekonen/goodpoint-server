import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import './console-log-obj';

import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
    console.log('Loading environment from:', envFile);
    config({ path: envFile });
} else {
    console.log('Production mode: Using Railway environment variables');
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const baseOrigin = 'https://goodpoint-client-production.up.railway.app';
    const allowedOrigins = [baseOrigin, process.env.CLIENT_DOMAIN].filter(Boolean);

    console.log('🌍 CORS Configuration:');
    console.log('- Allowed origins:', allowedOrigins);
    console.log('- CLIENT_DOMAIN env var:', process.env.CLIENT_DOMAIN);

    const corsOptions = {
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            console.log(`🔍 CORS request from origin: "${origin}"`);
            console.log(`🔍 Allowed origins: ${JSON.stringify(allowedOrigins)}`);

            if (!origin) {
                console.log('✅ CORS: Allowing request with no origin');
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS: Origin allowed');
                return callback(null, true);
            }

            console.log('❌ CORS: Origin blocked');
            return callback(new Error(`Not allowed by CORS: ${origin}`), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],

        exposedHeaders: ['Set-Cookie'],
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

    await app.listen(port, '0.0.0.0');

    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
    console.log(`🏥 Health check: http://0.0.0.0:${port}/api/health`);
}
bootstrap();
