import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff, UserPassword, User } from '../entities';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { UserPasswordService } from './user-password.service';
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
import { AccessLoggerService } from 'src/common/types/auth.types';

@Module({
    imports: [
        TypeOrmModule.forFeature([Staff, UserPassword, User]),
        UserSchoolModule,
        StarredUserClassesModule,
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
    providers: [StaffService, UserPasswordService, JwtService, AccessLoggerService],
    exports: [StaffService],
})
export class StaffModule {}
