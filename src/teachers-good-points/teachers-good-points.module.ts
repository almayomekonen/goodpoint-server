import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersGoodPoints } from 'src/entities/teachers-good-points.entity';
import { StaffModule } from 'src/staff/staff.module';
import { SmsService } from 'src/common/services/sms.service';
import { TeachersGoodPointsController } from './teachers-good-points.controller';
import { TeachersGoodPointsGateway } from './teachers-good-points.gateway';
import { TeachersGoodPointsService } from './teachers-good-points.service';
import { TeachersGoodPointsReaction } from 'src/entities/teachers-good-points-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TeachersGoodPoints, TeachersGoodPointsReaction]),
        forwardRef(() => StaffModule),
        ScheduleModule.forRoot(),
        JwtModule.register({}),
    ],
    controllers: [TeachersGoodPointsController],
    providers: [TeachersGoodPointsService, TeachersGoodPointsGateway, SmsService],
    exports: [TeachersGoodPointsService],
})
export class TeachersGoodPointsModule {}
