import { Role, SpamManagerModule, User } from '@hilma/auth-nest';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { ArchivedGoodPointModule } from './archived-good-point/archived-good-point.module';
import { ClassesModule } from './classes/classes.module';
import { GoodPointsModule } from './good-point/good-point.module';
import { GoodPointsPresetModule } from './good-points-preset/good-points-preset.module';
import { PresetMessagesModule } from './preset-messages/preset-messages.module';
import { RemovedPresetMessagesModule } from './removed-preset-messages/removed-preset-messages.module';
import { SchoolModule } from './school/school.module';
import { SmsModule } from './sms/sms.module';
import { StaffModule } from './staff/staff.module';
import { StudentModule } from './student/student.module';
import { StudyGroupModule } from './study-group/study-group.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { UserSchoolModule } from './user-school/user-school.module';

import {
    AccessToken,
    AdminActions,
    ArchivedGoodPoint,
    Classes,
    GoodPoint,
    GoodPointReaction,
    GoodPointsPreset,
    PresetMessages,
    RemovedPresetMessages,
    School,
    Sms,
    Staff,
    StarredUserClasses,
    Student,
    StudyGroup,
    UserSchool,
} from './entities';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenModule } from './access-token/access-token.module';
import { TeachersGoodPointsModule } from './teachers-good-points/teachers-good-points.module';

import { AdminActionsModule } from './admin-actions/admin-actions.module';
import { AccessTokenInterceptor } from './common/interceptors/AccessToken.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import configuration from './config/configuration';
import { ParentPhone } from './entities/parent-phone.entity';
import { StudyGroupGrades } from './entities/study-groups-grades.entity';
import { TeachersGoodPointsReaction } from './entities/teachers-good-points-reaction.entity';
import { TeachersGoodPoints } from './entities/teachers-good-points.entity';
import { TeachersGoodPointsReactionModule } from './teachers-good-points-reaction/teachers-good-points-reaction.module';
import { StarredUserClassesModule } from './user-classes/starred-user-classes.module';
import { IdmModule } from './idm/idm.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
            envFilePath: [
                `.env.${process.env.NODE_ENV || 'development'}.local`,
                `.env.${process.env.NODE_ENV || 'development'}`,
                '.env.local',
                '.env',
            ],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 3306,
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'z10mz10m',
            database: process.env.DB_NAME || 'good_point',
            ssl: process.env.DB_SSL === 'true',
            logging: process.env.DB_LOGGING && JSON.parse(process.env.DB_LOGGING),
            synchronize: process.env.DB_SYNCHRONIZE && JSON.parse(process.env.DB_SYNCHRONIZE),
            entities: [
                'node_modules/@hilma/auth-nest/dist/**/*.entity{.ts,.js}',
                AdminActions,
                ArchivedGoodPoint,
                Classes,
                GoodPoint,
                GoodPointReaction,
                GoodPointsPreset,
                ParentPhone,
                PresetMessages,
                RemovedPresetMessages,
                Role,
                School,
                Sms,
                Staff,
                Student,
                StudyGroup,
                TeachersGoodPoints,
                TeachersGoodPointsReaction,
                User,
                UserSchool,
                TeachersGoodPointsReaction,
                StudyGroupGrades,
                TeachersGoodPointsReaction,
                StarredUserClasses,
                AccessToken,
            ],
        }),
        SchoolModule,
        ClassesModule,
        StaffModule,
        StudentModule,
        GoodPointsModule,
        GoodPointsPresetModule,
        PresetMessagesModule,
        ArchivedGoodPointModule,
        AdminModule,
        AdminActionsModule,
        SuperAdminModule,
        RemovedPresetMessagesModule,
        UserSchoolModule,
        StarredUserClassesModule,
        SmsModule,
        TeachersGoodPointsModule,
        TeachersGoodPointsReactionModule,
        StudyGroupModule,
        SpamManagerModule,
        TeachersGoodPointsReactionModule,
        AccessTokenModule,
        IdmModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AccessTokenInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
