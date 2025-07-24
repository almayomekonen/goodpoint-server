import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudyGroup } from '../entities/study-group.entity';
import { StudyGroupController } from './study-group.controller';
import { StudyGroupService } from './study-group.service';

@Module({
    imports: [TypeOrmModule.forFeature([StudyGroup])],
    providers: [StudyGroupService],
    controllers: [StudyGroupController],
    exports: [StudyGroupService],
})
export class StudyGroupModule {}
