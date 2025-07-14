import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminActionsModule } from 'src/admin-actions/admin-actions.module';
import { ArchivedGoodPointModule } from 'src/archived-good-point/archived-good-point.module';
import { ClassesModule } from 'src/classes/classes.module';
import { Staff } from 'src/entities';
import { GoodPointsModule } from 'src/good-point/good-point.module';
import { StaffModule } from 'src/staff/staff.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { StudentModule } from 'src/student/student.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Staff]),
        StaffModule,
        ArchivedGoodPointModule,
        ClassesModule,
        AdminActionsModule,
        GoodPointsModule,
        StudentModule,
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule {}
