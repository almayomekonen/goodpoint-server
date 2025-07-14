import { AccessLoggerModule, UserModule, UserPasswordModule } from '@hilma/auth-nest';
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

@Module({
    imports: [
        TypeOrmModule.forFeature([Staff]),
        UserModule.register({ set_access_logger: true }),
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
            useValue: { extra_login_fields: ['schoolId'] },
        },
        JwtService,
    ],
    exports: [StaffService, UserModule],
})
export class StaffModule {}
