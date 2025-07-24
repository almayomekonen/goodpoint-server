import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirebaseAuthService } from './firebase-auth.service';
import { User } from '../entities/user.entity';
import { Staff } from '../entities/staff.entity';
import { Student } from '../entities/student.entity';

export interface UserLinkingResult {
    success: boolean;
    user?: User;
    firebaseUser?: any;
    message: string;
    action: 'linked' | 'created' | 'updated' | 'error';
}

@Injectable()
export class UserLinkingService {
    private readonly logger = new Logger(UserLinkingService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Staff)
        private readonly staffRepository: Repository<Staff>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        private readonly firebaseAuthService: FirebaseAuthService,
    ) {}

    async linkUserToFirebase(email: string, firebaseUid: string): Promise<UserLinkingResult> {
        try {
            this.logger.log(`Attempting to link user ${email} to Firebase UID ${firebaseUid}`);

            // Check if Firebase UID is already linked to another user
            const existingUserWithFirebaseUid = await this.userRepository.findOne({
                where: { firebaseUid },
            });

            if (existingUserWithFirebaseUid) {
                if (existingUserWithFirebaseUid.username === email) {
                    this.logger.log(`User ${email} is already linked to Firebase UID ${firebaseUid}`);
                    return {
                        success: true,
                        user: existingUserWithFirebaseUid,
                        message: 'User already linked',
                        action: 'linked',
                    };
                } else {
                    throw new ConflictException(`Firebase UID ${firebaseUid} is already linked to another user`);
                }
            }

            // Find user by email
            const user = await this.userRepository.findOne({
                where: { username: email },
                relations: ['roles'],
            });

            if (!user) {
                this.logger.warn(`User with email ${email} not found in database`);
                return {
                    success: false,
                    message: `User with email ${email} not found in database`,
                    action: 'error',
                };
            }

            // Update user with Firebase UID
            user.firebaseUid = firebaseUid;
            await this.userRepository.save(user);

            this.logger.log(`Successfully linked user ${email} to Firebase UID ${firebaseUid}`);

            return {
                success: true,
                user,
                message: 'User successfully linked to Firebase',
                action: 'linked',
            };
        } catch (error) {
            this.logger.error(`Failed to link user ${email} to Firebase:`, error);
            return {
                success: false,
                message: error.message,
                action: 'error',
            };
        }
    }

    async createAndLinkUser(email: string, userData: any): Promise<UserLinkingResult> {
        try {
            this.logger.log(`Creating and linking new user with email ${email}`);

            // Check if user already exists
            const existingUser = await this.userRepository.findOne({
                where: { username: email },
            });

            if (existingUser) {
                throw new ConflictException(`User with email ${email} already exists`);
            }

            // Create Firebase user
            const firebaseUser = await this.firebaseAuthService.createFirebaseUser(email, userData.password, {
                displayName: userData.displayName,
                emailVerified: userData.emailVerified || false,
                customClaims: userData.customClaims,
            });

            // Create user in database
            const newUser = this.userRepository.create({
                username: email,
                type: userData.type || 'staff',
                firebaseUid: firebaseUser.uid,
            });

            await this.userRepository.save(newUser);

            // Create specific user type (Staff or Student)
            if (userData.type === 'staff') {
                const staff = this.staffRepository.create({
                    id: newUser.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phoneNumber: userData.phoneNumber || '',
                    preferredLanguage: userData.preferredLanguage || 'HEBREW',
                    systemNotifications: userData.systemNotifications !== false,
                });
                await this.staffRepository.save(staff);
            } else if (userData.type === 'student') {
                // Note: Student entity uses numeric ID, so we need to handle this differently
                // For now, we'll create the student without setting the ID
                const student = this.studentRepository.create({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                });
                await this.studentRepository.save(student);
            }

            this.logger.log(`Successfully created and linked user ${email}`);

            return {
                success: true,
                user: newUser,
                firebaseUser,
                message: 'User created and linked successfully',
                action: 'created',
            };
        } catch (error) {
            this.logger.error(`Failed to create and link user ${email}:`, error);
            return {
                success: false,
                message: error.message,
                action: 'error',
            };
        }
    }

    async syncUserWithFirebase(email: string): Promise<UserLinkingResult> {
        try {
            this.logger.log(`Syncing user ${email} with Firebase`);

            // Get Firebase user
            const firebaseUser = await this.firebaseAuthService.getUserByEmail(email);
            if (!firebaseUser) {
                return {
                    success: false,
                    message: `Firebase user with email ${email} not found`,
                    action: 'error',
                };
            }

            // Find user in database
            const user = await this.userRepository.findOne({
                where: { username: email },
                relations: ['roles'],
            });

            if (!user) {
                return {
                    success: false,
                    message: `User with email ${email} not found in database`,
                    action: 'error',
                };
            }

            // Update user with Firebase UID if not already set
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUser.uid;
                await this.userRepository.save(user);
            }

            // Update Firebase user with database information
            const updates: any = {};

            if (user.type === 'staff') {
                const staff = await this.staffRepository.findOne({
                    where: { id: user.id as any },
                    select: ['firstName', 'lastName'],
                });
                if (staff) {
                    updates.displayName = `${staff.firstName} ${staff.lastName}`.trim();
                }
            } else if (user.type === 'student') {
                const student = await this.studentRepository.findOne({
                    where: { id: user.id as any },
                    select: ['firstName', 'lastName'],
                });
                if (student) {
                    updates.displayName = `${student.firstName} ${student.lastName}`.trim();
                }
            }

            if (Object.keys(updates).length > 0) {
                await this.firebaseAuthService.updateFirebaseUser(firebaseUser.uid, updates);
            }

            this.logger.log(`Successfully synced user ${email}`);

            return {
                success: true,
                user,
                firebaseUser,
                message: 'User synced successfully',
                action: 'updated',
            };
        } catch (error) {
            this.logger.error(`Failed to sync user ${email}:`, error);
            return {
                success: false,
                message: error.message,
                action: 'error',
            };
        }
    }

    async unlinkUserFromFirebase(email: string): Promise<UserLinkingResult> {
        try {
            this.logger.log(`Unlinking user ${email} from Firebase`);

            const user = await this.userRepository.findOne({
                where: { username: email },
            });

            if (!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }

            if (!user.firebaseUid) {
                return {
                    success: true,
                    user,
                    message: 'User was not linked to Firebase',
                    action: 'updated',
                };
            }

            // Remove Firebase UID from user
            user.firebaseUid = null;
            await this.userRepository.save(user);

            this.logger.log(`Successfully unlinked user ${email} from Firebase`);

            return {
                success: true,
                user,
                message: 'User unlinked from Firebase successfully',
                action: 'updated',
            };
        } catch (error) {
            this.logger.error(`Failed to unlink user ${email} from Firebase:`, error);
            return {
                success: false,
                message: error.message,
                action: 'error',
            };
        }
    }

    async getLinkingStatus(email: string): Promise<{
        linked: boolean;
        firebaseUid?: string;
        user?: User;
        firebaseUser?: any;
    }> {
        try {
            const user = await this.userRepository.findOne({
                where: { username: email },
            });

            if (!user) {
                return { linked: false };
            }

            const firebaseUser = user.firebaseUid
                ? await this.firebaseAuthService.getUserByUid(user.firebaseUid)
                : null;

            return {
                linked: !!user.firebaseUid,
                firebaseUid: user.firebaseUid,
                user,
                firebaseUser,
            };
        } catch (error) {
            this.logger.error(`Failed to get linking status for ${email}:`, error);
            return { linked: false };
        }
    }

    async migrateExistingUsers(): Promise<{
        total: number;
        linked: number;
        errors: number;
        details: string[];
    }> {
        const result = {
            total: 0,
            linked: 0,
            errors: 0,
            details: [] as string[],
        };

        try {
            this.logger.log('Starting migration of existing users to Firebase');

            // Get all users without Firebase UID
            const users = await this.userRepository.find({
                where: { firebaseUid: null },
                relations: ['roles'],
            });

            result.total = users.length;
            this.logger.log(`Found ${users.length} users to migrate`);

            for (const user of users) {
                try {
                    // Check if Firebase user exists
                    const firebaseUser = await this.firebaseAuthService.getUserByEmail(user.username);

                    if (firebaseUser) {
                        // Link existing Firebase user
                        const linkResult = await this.linkUserToFirebase(user.username, firebaseUser.uid);
                        if (linkResult.success) {
                            result.linked++;
                            result.details.push(`Linked ${user.username} to existing Firebase user`);
                        } else {
                            result.errors++;
                            result.details.push(`Failed to link ${user.username}: ${linkResult.message}`);
                        }
                    } else {
                        // Create new Firebase user
                        const createResult = await this.createAndLinkUser(user.username, {
                            type: user.type,
                            password: this.generateTemporaryPassword(),
                            emailVerified: true,
                        });

                        if (createResult.success) {
                            result.linked++;
                            result.details.push(`Created and linked ${user.username} to new Firebase user`);
                        } else {
                            result.errors++;
                            result.details.push(
                                `Failed to create Firebase user for ${user.username}: ${createResult.message}`,
                            );
                        }
                    }
                } catch (error) {
                    result.errors++;
                    result.details.push(`Error processing ${user.username}: ${error.message}`);
                }
            }

            this.logger.log(`Migration completed: ${result.linked} linked, ${result.errors} errors`);
            return result;
        } catch (error) {
            this.logger.error('Migration failed:', error);
            result.errors++;
            result.details.push(`Migration failed: ${error.message}`);
            return result;
        }
    }

    private generateTemporaryPassword(): string {
        return Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
    }
}
