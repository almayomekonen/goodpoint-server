import { Module } from '@nestjs/common';
import { AdminActionsService } from './admin-actions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminActions } from 'src/entities';

@Module({
    imports: [TypeOrmModule.forFeature([AdminActions])],
    providers: [AdminActionsService],
    exports: [AdminActionsService],
})
export class AdminActionsModule {}
