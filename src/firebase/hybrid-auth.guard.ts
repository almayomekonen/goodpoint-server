import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { FirebaseAuthService } from './firebase-auth.service';
import { ROLES_KEY } from './firebase-auth.guard';
import { Roles } from 'src/common/enums/roles.enum';

@Injectable()
export class HybridAuthGuard implements CanActivate {
    private readonly logger = new Logger(HybridAuthGuard.name);

    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
        private firebaseAuthService: FirebaseAuthService,
        @Inject(DataSource)
        private dataSource: DataSource,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        this.logger.log(`Hybrid auth check for ${request.method} ${request.url}`);

        // Try Firebase authentication first
        try {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                this.logger.log('Attempting Firebase authentication...');

                const decodedToken = await this.firebaseAuthService.verifyToken(token);
                if (decodedToken) {
                    this.logger.log('Firebase token verification successful, getting user from database...');

                    // Get authenticated user from database
                    const authenticatedUser = await this.firebaseAuthService.getAuthenticatedUser(decodedToken.uid);
                    this.logger.log(`Firebase user found: ${authenticatedUser.username} (${authenticatedUser.id})`);

                    // Check role authorization if required
                    if (requiredRoles && requiredRoles.length > 0) {
                        this.logger.log(`Required roles: ${JSON.stringify(requiredRoles)}`);
                        this.logger.log(`User roles: ${JSON.stringify(authenticatedUser.roles)}`);
                        this.logger.log(`User roleKeys: ${JSON.stringify(authenticatedUser.roleKeys)}`);

                        const hasRequiredRole = requiredRoles.some(
                            (role) =>
                                authenticatedUser.roles.includes(role) || authenticatedUser.roleKeys.includes(role),
                        );

                        this.logger.log(`Has required role: ${hasRequiredRole}`);

                        if (!hasRequiredRole) {
                            this.logger.warn(
                                `User ${authenticatedUser.username} lacks required roles: ${requiredRoles.join(', ')}`,
                            );
                            throw new UnauthorizedException('Insufficient permissions');
                        }
                    }

                    // Set Firebase user data on request
                    request.user = authenticatedUser;
                    request.firebaseUid = decodedToken.uid;
                    request.decodedToken = decodedToken;

                    this.logger.log(
                        `Firebase authentication completed successfully for user: ${authenticatedUser.username}`,
                    );
                    return true;
                } else {
                    this.logger.log('Firebase token verification returned null/undefined');
                }
            } else {
                this.logger.log('No Bearer token found in Authorization header');
            }
        } catch (firebaseError) {
            this.logger.log(`Firebase authentication failed: ${firebaseError.message}, trying custom token auth`);
        }

        // If Firebase fails, try custom access token authentication
        this.logger.log('Attempting legacy token authentication...');
        try {
            const token = this.extractTokenFromRequest(request);
            if (!token) {
                this.logger.log('No legacy token found in request');
                throw new UnauthorizedException('No authentication token provided');
            }

            // Validate access token using raw query
            const accessTokenResult = await this.dataSource.query(
                'SELECT * FROM access_token WHERE token = ? AND expirationDate > NOW()',
                [token],
            );

            if (!accessTokenResult || accessTokenResult.length === 0) {
                throw new UnauthorizedException('Invalid or expired access token');
            }

            const accessToken = accessTokenResult[0];

            // Get user with roles using raw query
            const userResult = await this.dataSource.query(
                'SELECT u.*, r.name as role_name FROM user u LEFT JOIN user_role ur ON u.id = ur.user_id LEFT JOIN role r ON ur.role_id = r.id WHERE u.id = ?',
                [accessToken.user_id],
            );

            if (!userResult || userResult.length === 0) {
                throw new UnauthorizedException('User not found');
            }

            const user = userResult[0];

            // Check role authorization if required
            if (requiredRoles && requiredRoles.length > 0) {
                const userRoleNames = userResult
                    .map((u) => u.role_name)
                    .filter(Boolean)
                    .map((name) => name.toUpperCase());
                const hasRequiredRole = requiredRoles.some(
                    (role) =>
                        userRoleNames.includes(role.toUpperCase()) ||
                        userRoleNames.includes('SUPERADMIN') ||
                        userRoleNames.includes('ADMIN'),
                );

                if (!hasRequiredRole) {
                    throw new UnauthorizedException('Insufficient permissions');
                }
            }

            // Set user data on request for controllers to use
            request.user = {
                id: user.id,
                username: user.username,
                type: user.type,
                roles: userResult.map((u) => u.role_name).filter(Boolean),
                schoolId: accessToken.school_id,
            };

            this.logger.log(`Custom token authentication successful for user: ${user.username}`);
            return true;
        } catch (tokenError) {
            this.logger.error(`Legacy token authentication failed: ${tokenError.message}`);
            this.logger.error('Both Firebase and legacy authentication failed');
            throw new UnauthorizedException('Authentication failed');
        }
    }

    private extractTokenFromRequest(request: any): string | null {
        // Try header first
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Try cookie
        const tokenName = process.env.ACCESS_TOKEN_NAME || 'access_token';
        const cookieToken = request.cookies?.[tokenName];
        if (cookieToken) {
            return cookieToken;
        }

        // Try body (for some legacy endpoints)
        if (request.body?.[tokenName]) {
            return request.body[tokenName];
        }

        return null;
    }
}
