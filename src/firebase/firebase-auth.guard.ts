import {
    CanActivate,
    ExecutionContext,
    Injectable,
    SetMetadata,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FirebaseAuthService } from './firebase-auth.service';

export const FIREBASE_AUTH_KEY = 'firebase_auth';
export const HYBRID_AUTH_KEY = 'hybrid_auth';
export const ROLES_KEY = 'roles';
export const SKIP_AUTH_KEY = 'skip_auth';

export const UseFirebaseAuth = (...roles: string[]) => {
    return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
        SetMetadata(FIREBASE_AUTH_KEY, true)(target, propertyName, descriptor);
        SetMetadata(ROLES_KEY, roles)(target, propertyName, descriptor);
    };
};

export const SkipAuth = () => {
    return SetMetadata(SKIP_AUTH_KEY, true);
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

    constructor(
        private reflector: Reflector,
        private firebaseAuthService: FirebaseAuthService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // 🔧 CRITICAL FIX: Always allow OPTIONS requests for CORS preflight
        if (request.method === 'OPTIONS') {
            console.log(`🔄 FirebaseAuthGuard: Allowing OPTIONS request for CORS preflight`);
            return true;
        }

        // Check if authentication should be skipped
        const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (skipAuth) {
            return true;
        }

        // Check if Firebase auth or hybrid auth is required
        const isFirebaseAuthRequired = this.reflector.getAllAndOverride<boolean>(FIREBASE_AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const isHybridAuthRequired = this.reflector.getAllAndOverride<boolean>(HYBRID_AUTH_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        console.log(`Global FirebaseAuthGuard: ${request.method} ${request.url}`);
        console.log(`  - isFirebaseAuthRequired: ${isFirebaseAuthRequired}`);
        console.log(`  - isHybridAuthRequired: ${isHybridAuthRequired}`);

        if (!isFirebaseAuthRequired && !isHybridAuthRequired) {
            console.log(`  - No auth required, allowing request`);
            return true;
        }

        // Extract token from header
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No authentication token provided');
        }

        // Rate limiting check
        const clientIp = this.getClientIp(request);
        if (!this.checkRateLimit(clientIp)) {
            throw new ForbiddenException('Rate limit exceeded. Please try again later.');
        }

        try {
            console.log(`  - Attempting to verify Firebase token: ${token.substring(0, 50)}...`);
            // Verify Firebase token
            const decodedToken = await this.firebaseAuthService.verifyToken(token);
            console.log(`  - Firebase token verified successfully for UID: ${decodedToken.uid}`);

            // Get authenticated user from database
            console.log(`  - Getting authenticated user for UID: ${decodedToken.uid}`);
            const authenticatedUser = await this.firebaseAuthService.getAuthenticatedUser(decodedToken.uid);
            console.log(`  - Authenticated user found: ${authenticatedUser.username} (${authenticatedUser.id})`);

            // Check role-based access control
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (requiredRoles && requiredRoles.length > 0) {
                const hasRequiredRole = requiredRoles.some(
                    (role) => authenticatedUser.roles.includes(role) || authenticatedUser.roleKeys.includes(role),
                );

                if (!hasRequiredRole) {
                    throw new ForbiddenException('Insufficient permissions for this operation');
                }
            }

            // Attach user to request
            request.user = authenticatedUser;
            request.firebaseUid = decodedToken.uid;
            request.decodedToken = decodedToken;

            return true;
        } catch (error) {
            if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
                console.log(`  - Auth error (known): ${error.message}`);
                throw error;
            }

            // Log the error for debugging
            console.error('❌ Firebase Authentication failed:');
            console.error(`   - Error type: ${error.constructor.name}`);
            console.error(`   - Error message: ${error.message}`);
            console.error(`   - Token (first 50 chars): ${token?.substring(0, 50)}...`);
            console.error(`   - Stack trace:`, error.stack);
            throw new UnauthorizedException('Authentication failed');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private getClientIp(request: any): string {
        return (
            request.ip ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket?.remoteAddress ||
            'unknown'
        );
    }

    private checkRateLimit(clientIp: string): boolean {
        const authConfig = this.configService.get('authentication');
        const now = Date.now();
        const windowMs = authConfig.rateLimitWindow;
        const maxRequests = authConfig.rateLimitMax;

        const clientData = this.rateLimitMap.get(clientIp);

        if (!clientData || now > clientData.resetTime) {
            // First request or window expired
            this.rateLimitMap.set(clientIp, {
                count: 1,
                resetTime: now + windowMs,
            });
            return true;
        }

        if (clientData.count >= maxRequests) {
            return false; // Rate limit exceeded
        }

        // Increment request count
        clientData.count++;
        return true;
    }

    // Cleanup expired rate limit entries
    private cleanupRateLimitMap(): void {
        const now = Date.now();
        for (const [ip, data] of this.rateLimitMap.entries()) {
            if (now > data.resetTime) {
                this.rateLimitMap.delete(ip);
            }
        }
    }
}
