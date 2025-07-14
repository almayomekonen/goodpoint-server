import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodPointsPreset } from '../entities';
import { GoodPointsPresetService } from './good-points-preset.service';

@Module({
    imports: [TypeOrmModule.forFeature([GoodPointsPreset])],
    providers: [GoodPointsPresetService],
    exports: [GoodPointsPresetService],
})
export class GoodPointsPresetModule {}
