import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetMessagesService } from './preset-messages.service';
import { PresetMessagesController } from './preset-messages.controller';
import { StaffModule } from 'src/staff/staff.module';
import { RemovedPresetMessages, PresetMessages } from 'src/entities';
import { RemovedPresetMessagesModule } from 'src/removed-preset-messages/removed-preset-messages.module';
import { GoodPointsPresetModule } from 'src/good-points-preset/good-points-preset.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PresetMessages, RemovedPresetMessages]),
        forwardRef(() => StaffModule),
        RemovedPresetMessagesModule,
        GoodPointsPresetModule,
    ],
    providers: [PresetMessagesService],
    controllers: [PresetMessagesController],
    exports: [PresetMessagesService],
})
export class PresetMessagesModule {}
