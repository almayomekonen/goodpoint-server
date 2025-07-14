import { Module } from '@nestjs/common';
import { StaffModule } from 'src/staff/staff.module';
import { IdmController } from './idm.controller';
import { IdmService } from './idm.service';

@Module({
    imports: [StaffModule],
    providers: [IdmService],
    controllers: [IdmController],
})
export class IdmModule {}
