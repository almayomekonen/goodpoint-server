import { UseJwtAuth } from '@hilma/auth-nest';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchoolId } from 'src/common/decorators';
import { AdminAddOrEditStudyGroupDto } from 'src/common/dtos/admin-add-or-edit-study-groups.dto';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { Roles } from 'src/common/enums/roles.enum';
import { StudyGroupsRow } from 'src/common/types/study-groups-table-row.type';
import { StudyGroupService } from './study-group.service';

@ApiTags('student')
@ApiBearerAuth('jwtAuth')
@Controller('api/study-group')
export class StudyGroupController {
    constructor(private readonly studyGroupService: StudyGroupService) {}
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Get('get-all-study-groups')
    getAllSchoolClasses(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAllSchoolStudyGroups(schoolId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('admin-get-study-groups')
    getAdminStudyGroups(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAdminStudyGroups(schoolId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('/admin-fetch-study-group/:id')
    async getStudyGroupDetails(@Param('id') id: number) {
        return await this.studyGroupService.getStudyGroupDetails(id);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Post('add-or-edit-study-group')
    addOrEditStudyGroup(@Body() body: AdminAddOrEditStudyGroupDto, @SchoolId() schoolId: number) {
        return this.studyGroupService.addOrEditStudyGroup(body, schoolId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Post('add-students-to-study-group')
    addStudentsToStudyGroup(@Body() details: { studentsIds: number[]; studyGroupId: number }) {
        return this.studyGroupService.addStudentsToStudyGroup(details.studentsIds, details.studyGroupId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('get-all-study-groups-grades')
    getAllStudyGroupsGrades(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAllStudyGroupsGrades(schoolId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Delete('delete-admin-study-groups')
    deleteAdminStudyGroups(@Body() body: AdminTableDto<StudyGroupsRow>, @SchoolId() schoolId: number) {
        return this.studyGroupService.deleteAdminStudyGroups(body, schoolId);
    }
}
