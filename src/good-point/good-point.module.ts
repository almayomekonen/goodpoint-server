import { SpamManagerModule, TwoFactorModule } from '@hilma/auth-nest';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodPoint } from 'src/entities';
import { TeachersGoodPoints } from 'src/entities/teachers-good-points.entity';
import { GoodPointsPresetModule } from 'src/good-points-preset/good-points-preset.module';
import { GoodPointReactionModule } from 'src/good-points-reactions/good-point-reaction.module';
import { StaffModule } from 'src/staff/staff.module';
import { StudentModule } from 'src/student/student.module';
import { GoodPointController } from './good-point.controller';
import { GoodPointService } from './good-point.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([GoodPoint, TeachersGoodPoints]),
        forwardRef(() => StaffModule),
        TwoFactorModule.register({ spamManagement: true }),
        StudentModule,
        GoodPointsPresetModule,
        GoodPointReactionModule,
        SpamManagerModule,
    ],
    controllers: [GoodPointController],
    providers: [GoodPointService],
    exports: [GoodPointService],
})
export class GoodPointsModule {}
