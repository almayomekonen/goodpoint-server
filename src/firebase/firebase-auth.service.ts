import { Injectable, Logger, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { User } from '../entities/user.entity';
import { Staff } from '../entities/staff.entity';
import { Student } from '../entities/student.entity';

export interface FirebaseUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
    customClaims?: any;
}

export interface AuthenticatedUser {
    id: string;
    uid: string;
    email: string;
    username: string;
    type: string;
    roles: string[];
    roleKeys: string[];
    schoolId?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    preferredLanguage?: string;
    systemNotifications?: boolean;
    customClaims?: any;
}

@Injectable()
export class FirebaseAuthService {
    private readonly logger = new Logger(FirebaseAuthService.name);
    private tokenCache = new Map<string, { token: admin.auth.DecodedIdToken; expiresAt: number }>();
    private readonly configService: ConfigService;

    constructor(
        configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Staff)
        private readonly staffRepository: Repository<Staff>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {
        this.configService = configService;
        this.initializeFirebase();
    }

    private initializeFirebase(): void {
        if (!admin.apps.length) {
            try {
                const firebaseConfig = this.configService.get('firebase');

                let credential: admin.credential.Credential;

                const serviceAccountPath = firebaseConfig.serviceAccountPath;
                if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
                    this.logger.log(`Initializing Firebase with service account file: ${serviceAccountPath}`);
                    credential = admin.credential.cert(serviceAccountPath);
                } else if (firebaseConfig.privateKey && firebaseConfig.clientEmail) {
                    this.logger.log('Initializing Firebase with environment variables');
                    credential = admin.credential.cert({
                        projectId: firebaseConfig.projectId,
                        privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
                        clientEmail: firebaseConfig.clientEmail,
                    });
                } else {
                    throw new Error('No Firebase credentials found');
                }

                admin.initializeApp({
                    credential,
                    projectId: firebaseConfig.projectId,
                });

                this.logger.log('Firebase Admin SDK initialized successfully');
            } catch (error) {
                this.logger.error('Failed to initialize Firebase Admin SDK:', error);
                throw new InternalServerErrorException('Firebase initialization failed');
            }
        }
    }

    async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            const authConfig = this.configService.get('authentication');
            if (authConfig.enableTokenCaching) {
                const cached = this.tokenCache.get(token);
                if (cached && cached.expiresAt > Date.now()) {
                    this.logger.debug('Token found in cache');
                    return cached.token;
                }
            }

            const decodedToken = await admin.auth().verifyIdToken(token);

            if (authConfig.enableTokenCaching) {
                const expiresAt = Date.now() + authConfig.cacheExpiration * 1000;
                this.tokenCache.set(token, { token: decodedToken, expiresAt });

                this.cleanupExpiredCache();
            }

            return decodedToken;
        } catch (error) {
            this.logger.error('Token verification failed:', error);
            if (error.code === 'auth/id-token-expired') {
                throw new UnauthorizedException('Token expired');
            } else if (error.code === 'auth/id-token-revoked') {
                throw new UnauthorizedException('Token revoked');
            } else if (error.code === 'auth/invalid-id-token') {
                throw new UnauthorizedException('Invalid token');
            } else {
                throw new UnauthorizedException('Authentication failed');
            }
        }
    }

    private cleanupExpiredCache(): void {
        const now = Date.now();
        for (const [token, data] of this.tokenCache.entries()) {
            if (data.expiresAt <= now) {
                this.tokenCache.delete(token);
            }
        }
    }

    async linkUserToFirebase(firebaseUid: string, email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { username: email },
                relations: ['roles'],
            });

            if (!user) {
                throw new UnauthorizedException('User not found in database');
            }

            user.firebaseUid = firebaseUid;
            await this.userRepository.save(user);

            this.logger.log(`Linked user ${email} to Firebase UID ${firebaseUid}`);
            return user;
        } catch (error) {
            this.logger.error('Failed to link user to Firebase:', error);
            throw error;
        }
    }

    async getAuthenticatedUser(firebaseUid: string): Promise<AuthenticatedUser> {
        try {
            this.logger.log(`Getting authenticated user for Firebase UID: ${firebaseUid}`);

            const user = await this.userRepository.findOne({
                where: { firebaseUid },
                relations: ['roles'],
            });

            if (!user) {
                this.logger.warn(`User not found in database for Firebase UID: ${firebaseUid}`);
                throw new UnauthorizedException('User not found in database');
            }

            this.logger.log(`Found user: ${user.username} (${user.id}) with type: ${user.type}`);
            const roleMap = {
                teacher: 'TEACHER',
                admin: 'ADMIN',
                principal: 'PRINCIPAL',
                super_admin: 'SUPERADMIN',
            };

            const roles = user.roles.map((role) => {
                const name = role.name?.toLowerCase();
                return roleMap[name] || role.name?.toUpperCase();
            });

            const roleKeys = [...roles];

            this.logger.log(`User roles: ${JSON.stringify(roles)}`);
            this.logger.log(`User roleKeys: ${JSON.stringify(roleKeys)}`);

            let primarySchool = null;
            if (user.type === 'staff' || user.type === 'admin' || user.type === 'principal') {
                this.logger.log(`Querying user schools for user ID: ${user.id}`);

                const userSchools = await this.userRepository.manager.query(
                    'SELECT us.*, s.name as school_name FROM user_school us LEFT JOIN school s ON us.school_id = s.id WHERE us.user_id = ? AND us.deletedAt IS NULL ORDER BY us.school_id LIMIT 1',
                    [user.id],
                );

                this.logger.log(`User schools query result:`, JSON.stringify(userSchools, null, 2));

                if (userSchools && userSchools.length > 0) {
                    primarySchool = userSchools[0];
                    this.logger.log(`Primary school found:`, JSON.stringify(primarySchool, null, 2));
                } else {
                    this.logger.warn(`No school associations found for user ${user.username} (${user.id})`);
                    this.logger.warn('This will cause API endpoints using @SchoolId() to fail');
                    this.logger.warn('Check user_school table for entries with this user_id and deletedAt IS NULL');

                    const deletedSchools = await this.userRepository.manager.query(
                        'SELECT us.*, s.name as school_name FROM user_school us LEFT JOIN school s ON us.school_id = s.id WHERE us.user_id = ?',
                        [user.id],
                    );

                    if (deletedSchools && deletedSchools.length > 0) {
                        this.logger.warn(
                            `Found ${deletedSchools.length} total associations (including deleted):`,
                            JSON.stringify(deletedSchools, null, 2),
                        );
                    } else {
                        this.logger.error(`No school associations found at all for user ${user.username} (${user.id})`);
                        this.logger.error('This user needs to be associated with a school in the user_school table');
                    }
                }
            }

            const authenticatedUser: AuthenticatedUser = {
                id: user.id,
                uid: firebaseUid,
                email: user.username,
                username: user.username,
                type: user.type,
                roles,
                roleKeys,
                schoolId: primarySchool?.school_id,
                customClaims: {},
            };

            this.logger.log(`Authenticated user schoolId: ${authenticatedUser.schoolId}`);
            this.logger.log(`Primary school data:`, JSON.stringify(primarySchool, null, 2));

            if (!authenticatedUser.schoolId) {
                this.logger.error(`⚠️ CRITICAL: User ${user.username} has no schoolId!`);
                this.logger.error('This will cause Dashboard and other API endpoints to fail');
                this.logger.error('Immediate action required: Associate this user with a school in user_school table');
            }

            if (user.type === 'staff' || user.type === 'admin' || user.type === 'principal') {
                const staff = await this.staffRepository.findOne({
                    where: { id: user.id as any },
                    select: ['firstName', 'lastName', 'phoneNumber', 'preferredLanguage', 'systemNotifications'],
                });
                if (staff) {
                    authenticatedUser.firstName = staff.firstName;
                    authenticatedUser.lastName = staff.lastName;
                    authenticatedUser.phoneNumber = staff.phoneNumber;
                    authenticatedUser.preferredLanguage = staff.preferredLanguage;
                    authenticatedUser.systemNotifications = staff.systemNotifications;
                }
            } else if (user.type === 'student') {
                const student = await this.studentRepository.findOne({
                    where: { id: user.id as any },
                    select: ['firstName', 'lastName'],
                });
                if (student) {
                    authenticatedUser.firstName = student.firstName;
                    authenticatedUser.lastName = student.lastName;
                }
            }

            this.logger.log(`Successfully created authenticated user object for: ${authenticatedUser.username}`);
            return authenticatedUser;
        } catch (error) {
            this.logger.error('Failed to get authenticated user:', error);
            throw error;
        }
    }

    async createFirebaseUser(email: string, password: string, userData?: any): Promise<FirebaseUser> {
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: userData?.displayName,
                emailVerified: userData?.emailVerified || false,
            });

            if (userData?.customClaims) {
                await admin.auth().setCustomUserClaims(userRecord.uid, userData.customClaims);
            }

            this.logger.log(`Created Firebase user: ${userRecord.uid} for email: ${email}`);

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                emailVerified: userRecord.emailVerified,
                customClaims: userData?.customClaims,
            };
        } catch (error) {
            this.logger.error('Failed to create Firebase user:', error);
            throw error;
        }
    }

    async updateFirebaseUser(uid: string, updates: any): Promise<void> {
        try {
            await admin.auth().updateUser(uid, updates);
            this.logger.log(`Updated Firebase user: ${uid}`);
        } catch (error) {
            this.logger.error('Failed to update Firebase user:', error);
            throw error;
        }
    }

    async setCustomClaims(uid: string, claims: object): Promise<void> {
        try {
            await admin.auth().setCustomUserClaims(uid, claims);
            this.logger.log(`Set custom claims for user: ${uid}`);
        } catch (error) {
            this.logger.error('Failed to set custom claims:', error);
            throw error;
        }
    }

    async deleteFirebaseUser(uid: string): Promise<void> {
        try {
            await admin.auth().deleteUser(uid);
            this.logger.log(`Deleted Firebase user: ${uid}`);
        } catch (error) {
            this.logger.error('Failed to delete Firebase user:', error);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<FirebaseUser | null> {
        try {
            const userRecord = await admin.auth().getUserByEmail(email);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                emailVerified: userRecord.emailVerified,
            };
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                return null;
            }
            this.logger.error('Failed to get user by email:', error);
            throw error;
        }
    }

    async getUserByUid(uid: string): Promise<FirebaseUser | null> {
        try {
            const userRecord = await admin.auth().getUser(uid);
            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                emailVerified: userRecord.emailVerified,
            };
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                return null;
            }
            this.logger.error('Failed to get user by UID:', error);
            throw error;
        }
    }

    async listUsers(maxResults: number = 1000): Promise<FirebaseUser[]> {
        try {
            const listUsersResult = await admin.auth().listUsers(maxResults);
            return listUsersResult.users.map((userRecord) => ({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                emailVerified: userRecord.emailVerified,
            }));
        } catch (error) {
            this.logger.error('Failed to list users:', error);
            throw error;
        }
    }

    async revokeRefreshTokens(uid: string): Promise<void> {
        try {
            await admin.auth().revokeRefreshTokens(uid);
            this.logger.log(`Revoked refresh tokens for user: ${uid}`);
        } catch (error) {
            this.logger.error('Failed to revoke refresh tokens:', error);
            throw error;
        }
    }

    async healthCheck(): Promise<{ status: string; timestamp: number }> {
        try {
            await admin.auth().listUsers(1);
            return {
                status: 'healthy',
                timestamp: Date.now(),
            };
        } catch (error) {
            this.logger.error('Firebase health check failed:', error);
            return {
                status: 'unhealthy',
                timestamp: Date.now(),
            };
        }
    }
}
