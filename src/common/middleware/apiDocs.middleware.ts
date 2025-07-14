import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { apiDocumentationCredentials } from 'src/lib/swagger/apiDocumentationCredentials';

/**
 * Middleware for handling API documentation route. add username and passwords authentication
 */
export function apiDocsMiddleware(app: INestApplication) {
    const httpAdapter = app.getHttpAdapter();

    app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
        function parseAuthHeader(input) {
            const [, encodedPart] = input.split(' ');
            const buff = Buffer.from(encodedPart, 'base64');
            const text = buff.toString('ascii');
            const [name, pass] = text.split(':');
            return { name, pass };
        }

        function unauthorizedResponse() {
            if (httpAdapter.getType() === 'fastify') {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic');
            } else {
                res.status(401);
                res.set('WWW-Authenticate', 'Basic');
            }
            next();
        }

        if (!req.headers.authorization) {
            return unauthorizedResponse();
        }

        const credentials = parseAuthHeader(req.headers.authorization);

        if (
            credentials?.name !== apiDocumentationCredentials.name ||
            credentials?.pass !== apiDocumentationCredentials.pass
        ) {
            return unauthorizedResponse();
        }

        next();
    });
}
