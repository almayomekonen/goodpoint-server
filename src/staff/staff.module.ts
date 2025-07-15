import { AccessLoggerModule, UserModule, UserPasswordService } from '@hilma/auth-nest';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../entities';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { JwtService } from '@nestjs/jwt';
import { UserSchoolModule } from 'src/user-school/user-school.module';
import { ClassesModule } from 'src/classes/classes.module';
import { StudyGroupModule } from 'src/study-group/study-group.module';
import { GoodPointsModule } from 'src/good-point/good-point.module';
import { TeachersGoodPointsModule } from 'src/teachers-good-points/teachers-good-points.module';
import { MailModule } from 'src/mail/mail.module';
import { StarredUserClassesModule } from 'src/user-classes/starred-user-classes.module';
import { SchoolModule } from 'src/school/school.module';
import { StudentModule } from 'src/student/student.module';
import { AccessTokenModule } from 'src/access-token/access-token.module';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPassword } from '@hilma/auth-nest';
import * as bcrypt from 'bcrypt';
import { MoreThan } from 'typeorm';

@Injectable()
export class FixedUserPasswordService {
    constructor(
        @InjectRepository(UserPassword)
        private userPasswordRepository: Repository<UserPassword>,
    ) {}

    async checkPassword(userId: string, password: string): Promise<boolean> {
        console.log(`[FixedUserPasswordService] *** CUSTOM SERVICE CALLED *** Checking password for userId: ${userId}`);

        const user = (await this.userPasswordRepository.manager.findOne('user', { where: { id: userId } })) as any;
        if (!user) {
            console.log(`[FixedUserPasswordService] User not found in user table: ${userId}`);
            return false;
        }

        console.log(`[FixedUserPasswordService] User found: ${user.username}, type: ${user.type}`);

        if (user.password) {
            console.log(`[FixedUserPasswordService] Found password in user table`);
            const isValid = bcrypt.compareSync(password, user.password);
            console.log(`[FixedUserPasswordService] Password validation result: ${isValid}`);
            return isValid;
        }

        console.log(`[FixedUserPasswordService] Checking user_password table`);
        const userPasswords = await this.userPasswordRepository
            .createQueryBuilder('userPassword')
            .select('userPassword.id')
            .addSelect('userPassword.password')
            .where('userPassword.userId = :userId', { userId })
            .orderBy('userPassword.id', 'DESC')
            .limit(3)
            .getMany();

        console.log(`[FixedUserPasswordService] Found ${userPasswords.length} passwords in user_password table`);

        for (const userPassword of userPasswords) {
            const isValid = bcrypt.compareSync(password, userPassword.password);
            console.log(`[FixedUserPasswordService] Password validation result: ${isValid}`);
            if (isValid) {
                return true;
            }
        }

        console.log(`[FixedUserPasswordService] No valid password found`);
        return false;
    }

    async changePasswordRequired(userId: string, validityMonths: number): Promise<boolean> {
        const date = new Date();
        date.setMonth(date.getMonth() - validityMonths);
        const res = await this.userPasswordRepository.findOne({
            where: {
                created: MoreThan(date),
                user: { id: userId },
            },
        });
        return res ? false : true;
    }

    async createUserPassword(userId: string, password: string): Promise<UserPassword> {
        const userPassword = this.userPasswordRepository.create({ user: { id: userId }, password });
        return this.userPasswordRepository.save(userPassword);
    }
}

@Module({
    imports: [
        TypeOrmModule.forFeature([Staff, UserPassword]),
        UserModule.register({
            set_access_logger: true,
            useUserPassword: true,
        }),
        UserSchoolModule,
        StarredUserClassesModule,
        // UserPasswordModule, // Commented out to avoid conflicts with our custom service
        AccessLoggerModule,
        AccessTokenModule,
        MailModule,
        forwardRef(() => ClassesModule),
        StudyGroupModule,
        forwardRef(() => GoodPointsModule),
        forwardRef(() => TeachersGoodPointsModule),
        SchoolModule,
        StudentModule,
    ],
    controllers: [StaffController],
    providers: [
        StaffService,
        {
            provide: 'USER_MODULE_OPTIONS',
            useValue: {
                extra_login_fields: ['schoolId'],
                useUserPassword: true,
            },
        },
        {
            provide: UserPasswordService,
            useClass: FixedUserPasswordService,
        },
        JwtService,
    ],
    exports: [StaffService, UserModule],
})
export class StaffModule {}
