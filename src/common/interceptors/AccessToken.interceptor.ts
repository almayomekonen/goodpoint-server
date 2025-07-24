import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AccessTokenInterceptor.name);

    constructor() {
        // Firebase auth is now handled by FirebaseAuthGuard
        // This interceptor is kept for compatibility but does minimal work
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        // Skip token validation for login route
        if (request.path === '/api/staff/login') {
            return next.handle();
        }

        // ✅ FIXED: Check if user exists (Firebase authenticated)
        if (request.user) {
            this.logger.debug(`Firebase-authenticated request to: ${request.path} - skipping interceptor checks`);
            return next.handle();
        }

        // Firebase token validation is now handled by FirebaseAuthGuard
        // This interceptor just logs requests for monitoring
        this.logger.debug(`Request to: ${request.path}`);

        return next.handle();
    }
}
