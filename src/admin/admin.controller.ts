import { RequestUser, UseJwtAuth } from '@hilma/auth-nest';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleIds } from 'src/common/enums/role-ids.enum';
import { Roles } from 'src/common/enums/roles.enum';
import { StaffService } from 'src/staff/staff.service';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './utils/dtos/createAdminDto.dto';

@ApiTags('Admin')
@ApiBearerAuth('jwtAuth')
@Controller('api/admin')
export class AdminController {
    constructor(
        private readonly staffService: StaffService,
        private readonly adminService: AdminService,
    ) {}

    @ApiOperation({ summary: 'Add an admin' })
    @ApiCreatedResponse({ description: 'Admin successfully added.' })
    @UseJwtAuth(Roles.SUPERADMIN)
    @Post('/add-admin')
    AddAdmin(@Body() user: CreateAdminDto) {
        return this.staffService.registerUser(RoleIds.ADMIN, user);
    }

    @ApiOperation({
        summary: 'Start a new year',
        description: 'WARNING: !!! THIS ACTION STARTS A NEW YEAR AND IS DISRUPTIVE !!!',
    })
    @ApiResponse({ status: 200, description: 'New year started successfully.' })
    @UseJwtAuth(Roles.SUPERADMIN)
    @Post('/start-new-year')
    async moveYear(@RequestUser('id') adminId: string) {
        await this.adminService.startNewYear(adminId);
        return { success: true };
    }
}
