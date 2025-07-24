import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemovedPresetMessages } from '../entities';
import { RemovedPresetMessagesService } from './removed-preset-messages.service';

@Module({
    imports: [TypeOrmModule.forFeature([RemovedPresetMessages])],
    providers: [RemovedPresetMessagesService],
    exports: [RemovedPresetMessagesService],
})
export class RemovedPresetMessagesModule {}
