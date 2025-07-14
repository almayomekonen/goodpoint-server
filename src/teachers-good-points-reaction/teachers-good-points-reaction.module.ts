import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersGoodPointsReaction } from 'src/entities/teachers-good-points-reaction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TeachersGoodPointsReaction])],
})
export class TeachersGoodPointsReactionModule {}
