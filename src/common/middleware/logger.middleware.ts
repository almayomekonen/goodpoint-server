import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(request: Request, response: Response, next: NextFunction) {
        const { method, originalUrl } = request;
        const startTime = Date.now();

        response.on('finish', () => {
            const endTime = Date.now();
            const timeElapsed = endTime - startTime;
            const { statusCode } = response;

            // פשוט בלי chalk:
            this.logger.log(`${method} ${originalUrl} ${statusCode} +${timeElapsed}ms`);
        });

        next();
    }
}
