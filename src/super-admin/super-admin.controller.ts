import { Controller } from '@nestjs/common';
import { StaffService } from 'src/staff/staff.service';

@Controller('api/super-admin')
export class SuperAdminController {
    constructor(private readonly staffService: StaffService) {}
}
