import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StarredUserClasses } from 'src/entities';
import { StarredUserClassesService } from './starred-user-classes.service';

@Module({
    imports: [TypeOrmModule.forFeature([StarredUserClasses])],
    providers: [StarredUserClassesService],
    exports: [StarredUserClassesService],
})
export class StarredUserClassesModule {}
