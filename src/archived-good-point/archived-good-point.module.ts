import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchivedGoodPoint } from '../entities/archived-good-point.entity';
import { ArchivedGoodPointService } from './archived-good-point.service';
import { GoodPointsModule } from 'src/good-point/good-point.module';

@Module({
    imports: [TypeOrmModule.forFeature([ArchivedGoodPoint]), GoodPointsModule],
    providers: [ArchivedGoodPointService],
    exports: [ArchivedGoodPointService],
})
export class ArchivedGoodPointModule {}
