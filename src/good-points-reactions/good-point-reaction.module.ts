import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodPointReaction } from 'src/entities/good-point-reaction.entity';
import { GoodPointsReactionsService } from './good-points-reactions.service';
import { GoodPointsReactionsController } from './good-points-reactions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GoodPointReaction])],
    providers: [GoodPointsReactionsService],
    exports: [GoodPointsReactionsService],
    controllers: [GoodPointsReactionsController],
})
export class GoodPointReactionModule {}
