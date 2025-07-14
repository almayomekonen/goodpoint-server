import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesModule } from 'src/classes/classes.module';
import { GoodPointsModule } from 'src/good-point/good-point.module';
import { PresetMessagesModule } from 'src/preset-messages/preset-messages.module';
import { StaffModule } from 'src/staff/staff.module';
import { StudentModule } from 'src/student/student.module';
import { TeachersGoodPointsModule } from 'src/teachers-good-points/teachers-good-points.module';
import { UserSchoolModule } from 'src/user-school/user-school.module';
import { School } from '../entities';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([School]),
        forwardRef(() => PresetMessagesModule),
        forwardRef(() => GoodPointsModule),
        forwardRef(() => StaffModule),
        forwardRef(() => StudentModule),
        forwardRef(() => ClassesModule),
        forwardRef(() => GoodPointsModule),
        TeachersGoodPointsModule,
        UserSchoolModule,
    ],
    controllers: [SchoolController],
    providers: [SchoolService],
    exports: [SchoolService],
})
export class SchoolModule {}
