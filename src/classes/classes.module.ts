import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolModule } from 'src/school/school.module';
import { StaffModule } from 'src/staff/staff.module';
import { StudentModule } from 'src/student/student.module';
import { StudyGroupModule } from 'src/study-group/study-group.module';
import { Classes } from '../entities';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Classes]),
        forwardRef(() => StudentModule),
        forwardRef(() => StaffModule),
        StudyGroupModule,
        SchoolModule,
    ],
    providers: [ClassesService],
    controllers: [ClassesController],
    exports: [ClassesService],
})
export class ClassesModule {}
