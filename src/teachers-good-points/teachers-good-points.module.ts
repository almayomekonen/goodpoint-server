import { TwoFactorModule, UserModule } from '@hilma/auth-nest';
import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersGoodPoints } from 'src/entities/teachers-good-points.entity';
import { StaffModule } from 'src/staff/staff.module';
import { TeachersGoodPointsController } from './teachers-good-points.controller';
import { TeachersGoodPointsGateway } from './teachers-good-points.gateway';
import { TeachersGoodPointsService } from './teachers-good-points.service';
import { TeachersGoodPointsReaction } from 'src/entities/teachers-good-points-reaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TeachersGoodPoints, TeachersGoodPointsReaction]),
        UserModule,
        forwardRef(() => StaffModule),
        TwoFactorModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [TeachersGoodPointsController],
    providers: [TeachersGoodPointsService, TeachersGoodPointsGateway],
    exports: [TeachersGoodPointsService],
})
export class TeachersGoodPointsModule {}
