import { Controller, Post, Get, Body, Param, Request, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FirebaseAuthService } from './firebase-auth.service';
import { UserLinkingService } from './user-linking.service';
import { UseFirebaseAuth, SkipAuth } from './firebase-auth.guard';
import { Roles } from '../common/enums/roles.enum';

export class LinkUserDto {
    email: string;
    firebaseUid: string;
}

export class CreateUserDto {
    email: string;
    password: string;
    type: 'staff' | 'student';
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    preferredLanguage?: string;
    systemNotifications?: boolean;
    customClaims?: any;
}

export class SyncUserDto {
    email: string;
}

@ApiTags('Firebase Authentication')
@Controller('api/firebase')
export class FirebaseAuthController {
    constructor(
        private readonly firebaseAuthService: FirebaseAuthService,
        private readonly userLinkingService: UserLinkingService,
    ) {}

    @SkipAuth()
    @Post('verify-token')
    @ApiOperation({ summary: 'Verify Firebase ID token' })
    @ApiResponse({ status: 200, description: 'Token verified successfully' })
    @ApiResponse({ status: 401, description: 'Invalid token' })
    async verifyToken(@Body() body: { token: string }) {
        try {
            const decodedToken = await this.firebaseAuthService.verifyToken(body.token);
            const authenticatedUser = await this.firebaseAuthService.getAuthenticatedUser(decodedToken.uid);

            return {
                success: true,
                user: authenticatedUser,
                token: decodedToken,
            };
        } catch (error) {
            throw new HttpException({ success: false, message: error.message }, HttpStatus.UNAUTHORIZED);
        }
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Post('link-user')
    @ApiOperation({ summary: 'Link existing user to Firebase' })
    @ApiResponse({ status: 200, description: 'User linked successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async linkUser(@Body() linkUserDto: LinkUserDto) {
        const result = await this.userLinkingService.linkUserToFirebase(linkUserDto.email, linkUserDto.firebaseUid);

        if (!result.success) {
            throw new HttpException({ success: false, message: result.message }, HttpStatus.BAD_REQUEST);
        }

        return {
            success: true,
            message: result.message,
            user: result.user,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Post('create-user')
    @ApiOperation({ summary: 'Create new user and link to Firebase' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'User already exists' })
    async createUser(@Body() createUserDto: CreateUserDto) {
        const result = await this.userLinkingService.createAndLinkUser(createUserDto.email, createUserDto);

        if (!result.success) {
            const status = result.message.includes('already exists') ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST;
            throw new HttpException({ success: false, message: result.message }, status);
        }

        return {
            success: true,
            message: result.message,
            user: result.user,
            firebaseUser: result.firebaseUser,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Post('sync-user')
    @ApiOperation({ summary: 'Sync user between Firebase and database' })
    @ApiResponse({ status: 200, description: 'User synced successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async syncUser(@Body() syncUserDto: SyncUserDto) {
        const result = await this.userLinkingService.syncUserWithFirebase(syncUserDto.email);

        if (!result.success) {
            throw new HttpException({ success: false, message: result.message }, HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            message: result.message,
            user: result.user,
            firebaseUser: result.firebaseUser,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Post('unlink-user')
    @ApiOperation({ summary: 'Unlink user from Firebase' })
    @ApiResponse({ status: 200, description: 'User unlinked successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async unlinkUser(@Body() body: { email: string }) {
        const result = await this.userLinkingService.unlinkUserFromFirebase(body.email);

        if (!result.success) {
            throw new HttpException({ success: false, message: result.message }, HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            message: result.message,
            user: result.user,
        };
    }

    @SkipAuth()
    @Get('linking-status/:email')
    @ApiOperation({ summary: 'Get user linking status' })
    @ApiResponse({ status: 200, description: 'Linking status retrieved' })
    async getLinkingStatus(@Param('email') email: string) {
        const status = await this.userLinkingService.getLinkingStatus(email);

        return {
            success: true,
            ...status,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Post('migrate-users')
    @ApiOperation({ summary: 'Migrate existing users to Firebase' })
    @ApiResponse({ status: 200, description: 'Migration completed' })
    async migrateUsers() {
        const result = await this.userLinkingService.migrateExistingUsers();

        return {
            success: true,
            ...result,
        };
    }

    @SkipAuth()
    @Get('health')
    @ApiOperation({ summary: 'Check Firebase health status' })
    @ApiResponse({ status: 200, description: 'Health check completed' })
    async healthCheck() {
        const health = await this.firebaseAuthService.healthCheck();

        return {
            success: true,
            ...health,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Get('users')
    @ApiOperation({ summary: 'List Firebase users' })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
    async listUsers(@Request() req: any) {
        const { maxResults = 1000 } = req.query;
        const users = await this.firebaseAuthService.listUsers(parseInt(maxResults));

        return {
            success: true,
            users,
            count: users.length,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Get('user/:uid')
    @ApiOperation({ summary: 'Get Firebase user by UID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserByUid(@Param('uid') uid: string) {
        const user = await this.firebaseAuthService.getUserByUid(uid);

        if (!user) {
            throw new HttpException({ success: false, message: 'User not found' }, HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            user,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN, Roles.ADMIN)
    @Get('user/email/:email')
    @ApiOperation({ summary: 'Get Firebase user by email' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserByEmail(@Param('email') email: string) {
        const user = await this.firebaseAuthService.getUserByEmail(email);

        if (!user) {
            throw new HttpException({ success: false, message: 'User not found' }, HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            user,
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Post('user/:uid/revoke-tokens')
    @ApiOperation({ summary: 'Revoke refresh tokens for user' })
    @ApiResponse({ status: 200, description: 'Tokens revoked successfully' })
    async revokeTokens(@Param('uid') uid: string) {
        await this.firebaseAuthService.revokeRefreshTokens(uid);

        return {
            success: true,
            message: 'Refresh tokens revoked successfully',
        };
    }

    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Post('user/:uid/delete')
    @ApiOperation({ summary: 'Delete Firebase user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    async deleteUser(@Param('uid') uid: string) {
        await this.firebaseAuthService.deleteFirebaseUser(uid);

        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
}
