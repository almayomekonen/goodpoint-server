import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodPoint } from 'src/entities';
import { TeachersGoodPoints } from 'src/entities/teachers-good-points.entity';
import { GoodPointsPresetModule } from 'src/good-points-preset/good-points-preset.module';
import { GoodPointReactionModule } from 'src/good-points-reactions/good-point-reaction.module';
import { StaffModule } from 'src/staff/staff.module';
import { StudentModule } from 'src/student/student.module';
import { SpamManagerService } from 'src/common/services/spam-manager.service';
import { SmsService } from 'src/common/services/sms.service';
import { GoodPointController } from './good-point.controller';
import { GoodPointService } from './good-point.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GoodPoint, TeachersGoodPoints]),
        forwardRef(() => StaffModule),
        StudentModule,
        GoodPointsPresetModule,
        GoodPointReactionModule,
    ],
    controllers: [GoodPointController],
    providers: [GoodPointService, SpamManagerService, SmsService],
    exports: [GoodPointService],
})
export class GoodPointsModule {}
