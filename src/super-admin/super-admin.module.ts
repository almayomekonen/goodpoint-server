import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from 'src/entities';
import { StaffModule } from 'src/staff/staff.module';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';

@Module({
    imports: [TypeOrmModule.forFeature([Staff]), StaffModule],
    controllers: [SuperAdminController],
    providers: [SuperAdminService],
})
export class SuperAdminModule {}
