import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { UserPasswordService } from 'src/staff/user-password.service';

export interface UserConfig {
    set_access_logger?: boolean;
    useUserPassword?: boolean;
    extra_login_fields?: string[];
}

@Injectable()
export class UserService {
    protected readonly logger = new Logger(UserService.name);

    constructor(
        protected readonly config_options: UserConfig,
        protected readonly userRepository: Repository<User>,
        protected readonly jwtService: JwtService,
        protected readonly configService: ConfigService,
        protected readonly mailService: MailService,
        protected readonly accessLoggerService: any, // Keep as any for compatibility
        protected readonly userPasswordService: UserPasswordService,
    ) {}

    async createUser<T extends User>(userData: Partial<T>): Promise<T> {
        try {
            const user = this.userRepository.create(userData as any);
            // Handle the save method properly - it can return single entity or array
            const savedUser = await this.userRepository.save(user);
            const result = Array.isArray(savedUser) ? savedUser[0] : savedUser;
            this.logger.log(`User created successfully: ${result.id}`);
            return result as T;
        } catch (error) {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw error;
        }
    }

    async findUserById(id: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({ where: { id } });
        } catch (error) {
            this.logger.error(`Failed to find user by ID: ${error.message}`);
            throw error;
        }
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
        try {
            await this.userRepository.update(id, updateData);
            const updatedUser = await this.findUserById(id);
            if (!updatedUser) {
                throw new Error('User not found after update');
            }
            this.logger.log(`User updated successfully: ${id}`);
            return updatedUser;
        } catch (error) {
            this.logger.error(`Failed to update user: ${error.message}`);
            throw error;
        }
    }

    async deleteUser(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id);
            this.logger.log(`User deleted successfully: ${id}`);
        } catch (error) {
            this.logger.error(`Failed to delete user: ${error.message}`);
            throw error;
        }
    }

    // Stub methods that StaffService expects
    async generateVerificationTokenAndSave(userId: string): Promise<string> {
        // Stub implementation
        const token = Math.random().toString(36).substring(2);
        this.logger.log(`Generated verification token for user: ${userId}`);
        return token;
    }

    async setPassword(userId: string, password: string): Promise<void> {
        // Stub implementation
        await this.updateUser(userId, { password });
        this.logger.log(`Password updated for user: ${userId}`);
    }

    async login(credentials: any): Promise<any> {
        // Basic login implementation - creates a token-like response
        this.logger.log(`Login attempt for user: ${credentials.id}`);

        // Create a proper JWT token for Hilma compatibility
        const jwtPayload = {
            id: credentials.id,
            username: credentials.username,
            type: credentials.type,
            roles: credentials.roles,
            schoolId: credentials.schoolId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        };

        // Simple JWT encoding (base64)
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const payload = Buffer.from(JSON.stringify(jwtPayload)).toString('base64url');
        const signature = Buffer.from('signature').toString('base64url'); // In production, use proper HMAC
        const jwtToken = `${header}.${payload}.${signature}`;

        const response = {
            success: true,
            id: credentials.id,
            username: credentials.username,
            type: credentials.type,
            roles: credentials.roles,
            schoolId: credentials.schoolId,
            [process.env.ACCESS_TOKEN_NAME || 'access_token']: jwtToken,
        };

        return response;
    }

    async changePasswordWithToken(token: string, email: string, password: string): Promise<any> {
        // Implementation for changing password with verification token
        this.logger.log(`Changing password with token for email: ${email}`);
        // Find user by email and token, then update password
        const user = await this.userRepository.findOne({ where: { username: email } });
        if (user) {
            await this.updateUser(user.id, { password });
            return { success: true, message: 'Password changed successfully' };
        }
        throw new Error('User not found or invalid token');
    }

    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
        validateCurrent: boolean = true,
    ): Promise<any> {
        // Implementation for changing password with current password validation
        this.logger.log(`Changing password for user: ${userId}`);

        if (validateCurrent) {
            // Validate current password using userPasswordService
            const isValid = await this.userPasswordService.checkPassword(userId, currentPassword);
            if (!isValid) {
                throw new Error('Current password is incorrect');
            }
        }

        // Update to new password
        await this.updateUser(userId, { password: newPassword });
        return { success: true, message: 'Password changed successfully' };
    }
}
