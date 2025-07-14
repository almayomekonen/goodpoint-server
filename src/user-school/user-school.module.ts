import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchool } from '../entities';
import { UserSchoolService } from './user-school.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserSchool])],
    providers: [UserSchoolService],
    exports: [UserSchoolService],
})
export class UserSchoolModule {}
