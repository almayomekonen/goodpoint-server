import { AccessLoggerModule, UserModule, UserPasswordModule, UserPasswordService } from '@hilma/auth-nest';
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

// Custom UserPasswordService that fixes the checkPassword bug
@Injectable()
export class FixedUserPasswordService {
    constructor(
        @InjectRepository(UserPassword)
        private userPasswordRepository: Repository<UserPassword>,
    ) {}

    async checkPassword(userId: string, password: string): Promise<boolean> {
        const userPasswords = await this.userPasswordRepository
            .createQueryBuilder('userPassword')
            .select('userPassword.id')
            .addSelect('userPassword.password')
            .innerJoin('userPassword.user', 'user', 'user.id = :userId', { userId })
            .orderBy('userPassword.id', 'DESC')
            .limit(3)
            .getMany();

        for (const userPassword of userPasswords) {
            if (bcrypt.compareSync(password, userPassword.password)) {
                return true; // Fixed: return true when password matches
            }
        }
        return false; // Return false when no password matches
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
            useUserPassword: false,
        }),
        UserSchoolModule,
        StarredUserClassesModule,
        UserPasswordModule,
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
                useUserPassword: false,
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
