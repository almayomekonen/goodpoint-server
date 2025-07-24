import { UseFirebaseAuth } from 'src/firebase/firebase-auth.guard';
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
    @UseFirebaseAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Get('get-all-study-groups')
    getAllSchoolClasses(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAllSchoolStudyGroups(schoolId);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Get('admin-get-study-groups')
    getAdminStudyGroups(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAdminStudyGroups(schoolId);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Get('/admin-fetch-study-group/:id')
    async getStudyGroupDetails(@Param('id') id: number) {
        return await this.studyGroupService.getStudyGroupDetails(id);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Post('add-or-edit-study-group')
    addOrEditStudyGroup(@Body() body: AdminAddOrEditStudyGroupDto, @SchoolId() schoolId: number) {
        return this.studyGroupService.addOrEditStudyGroup(body, schoolId);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Post('add-students-to-study-group')
    addStudentsToStudyGroup(@Body() details: { studentsIds: number[]; studyGroupId: number }) {
        return this.studyGroupService.addStudentsToStudyGroup(details.studentsIds, details.studyGroupId);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Get('get-all-study-groups-grades')
    getAllStudyGroupsGrades(@SchoolId() schoolId: number) {
        return this.studyGroupService.getAllStudyGroupsGrades(schoolId);
    }

    @UseFirebaseAuth(Roles.ADMIN)
    @Delete('delete-admin-study-groups')
    deleteAdminStudyGroups(@Body() body: AdminTableDto<StudyGroupsRow>, @SchoolId() schoolId: number) {
        return this.studyGroupService.deleteAdminStudyGroups(body, schoolId);
    }
}
