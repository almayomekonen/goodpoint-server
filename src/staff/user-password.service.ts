import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserPassword, User } from '../entities';

@Injectable()
export class UserPasswordService {
    constructor(
        @InjectRepository(UserPassword)
        private userPasswordRepository: Repository<UserPassword>,
    ) {
        console.log('[UserPasswordService] Constructor called - service is being instantiated');
    }

    async checkPassword(userId: string, password: string): Promise<boolean> {
        console.log(`[UserPasswordService] *** CUSTOM SERVICE CALLED *** Checking password for userId: ${userId}`);

        const user = (await this.userPasswordRepository.manager.findOne('user', { where: { id: userId } })) as any;
        if (!user) {
            console.log(`[UserPasswordService] User not found in user table: ${userId}`);
            return false;
        }

        console.log(`[UserPasswordService] User found: ${user.username}, type: ${user.type}`);

        if (user.password) {
            console.log(`[UserPasswordService] Found password in user table`);
            const isValid = bcrypt.compareSync(password, user.password);
            console.log(`[UserPasswordService] Password validation result: ${isValid}`);
            return isValid;
        }

        console.log(`[UserPasswordService] No password found in user table, checking user_password table`);
        const userPasswords = await this.userPasswordRepository
            .createQueryBuilder('userPassword')
            .leftJoin('userPassword.user', 'user')
            .where('user.id = :userId', { userId })
            .orderBy('userPassword.id', 'DESC')
            .limit(3)
            .getMany();

        console.log(`[UserPasswordService] Found ${userPasswords.length} passwords in user_password table`);

        for (const userPassword of userPasswords) {
            const isValid = bcrypt.compareSync(password, userPassword.password);
            console.log(`[UserPasswordService] Password validation result: ${isValid}`);
            if (isValid) {
                return true;
            }
        }

        console.log(`[UserPasswordService] No valid password found`);
        return false;
    }

    async setPassword(userId: string, password: string): Promise<void> {
        console.log(`[UserPasswordService] Setting password for userId: ${userId}`);

        const hashedPassword = bcrypt.hashSync(password, 10);

        // Check if a password entry already exists
        const existingPassword = await this.userPasswordRepository
            .createQueryBuilder('userPassword')
            .leftJoin('userPassword.user', 'user')
            .where('user.id = :userId', { userId })
            .getOne();

        if (existingPassword) {
            // Update existing
            await this.userPasswordRepository.update(existingPassword.id, {
                password: hashedPassword,
            });
            console.log(`[UserPasswordService] Updated existing password for userId: ${userId}`);
        } else {
            // Create new
            const newPassword = this.userPasswordRepository.create({
                user: { id: userId } as User,
                password: hashedPassword,
            });
            await this.userPasswordRepository.save(newPassword);
            console.log(`[UserPasswordService] Created new password for userId: ${userId}`);
        }
    }

    async changePasswordRequired(userId: string, validityMonths: number): Promise<boolean> {
        const date = new Date();
        date.setMonth(date.getMonth() - validityMonths);
        const res = await this.userPasswordRepository
            .createQueryBuilder('userPassword')
            .leftJoin('userPassword.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('userPassword.created > :date', { date })
            .getOne();
        return res ? false : true;
    }

    async createUserPassword(userId: string, password: string): Promise<UserPassword> {
        const userPassword = this.userPasswordRepository.create({
            user: { id: userId } as User,
            password: bcrypt.hashSync(password, 10),
        });
        return this.userPasswordRepository.save(userPassword);
    }
}
