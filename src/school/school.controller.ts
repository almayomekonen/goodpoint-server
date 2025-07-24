import { RequestUser } from 'src/firebase/firebase-auth.decorators';
import { UseFirebaseAuth, FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchoolId } from 'src/common/decorators';
import { PaginationAdminTableDto } from 'src/common/dtos/get-student-teachers-admin-tabledto.dto';
import { PaginationQueryDto } from 'src/common/dtos/get-student-teachers-query-dto.dto';
import { Roles } from 'src/common/enums/roles.enum';

import { UserSchoolService } from 'src/user-school/user-school.service';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './utils/dtos/create-school-dto.dto';
import { UpdateSchoolDto } from './utils/dtos/update-school-dto.dto';

import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Schools')
@ApiBearerAuth('jwtAuth')
@UseGuards(FirebaseAuthGuard)
@Controller('api/schools')
export class SchoolController {
    constructor(
        private readonly schoolsService: SchoolService,
        private readonly userSchoolService: UserSchoolService,
    ) {}

    @ApiOperation({ summary: 'Add a new school' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Post('/add-school')
    addSchool(@Body() school: CreateSchoolDto) {
        return this.schoolsService.addSchool({
            ...school,
            code: parseInt(school.code),
        });
    }

    @ApiOperation({ summary: 'Get all schools' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Get('/get-schools')
    getAllSchools() {
        return this.schoolsService.getSchoolsAndStudentsCount();
    }

    @ApiOperation({ summary: 'Update a school' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Patch('/update-school')
    updateSchool(@Body() school: UpdateSchoolDto) {
        return this.schoolsService.updateSchool({
            ...school,
            code: parseInt(school.code),
        });
    }

    @ApiOperation({ summary: 'Get students of a school' })
    @UseFirebaseAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-students-of-school')
    getStudentsOfSchool(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number | null,
        @Query() query: PaginationQueryDto,
    ) {
        if (!schoolId) {
            throw new Error('School ID is required but not found in user context');
        }

        return this.schoolsService.getStudentsOfSchool(
            schoolId,
            query.pageNumber,
            query.perPage,
            userId,
            query.filterName,
        );
    }

    @ApiOperation({ summary: 'Get paginated students of a school for admin' })
    @UseFirebaseAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Post('get-students-of-school-admin')
    getAdminStudentPaginated(@SchoolId() schoolId: number, @Body('params') params: PaginationAdminTableDto) {
        return this.schoolsService.getAdminStudentPaginated(
            schoolId,
            params.pageNumber,
            params.perPage,
            params.q,
            params.grade,
        );
    }

    @ApiOperation({ summary: 'Delete a school' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Delete('/delete-school')
    deleteSchool(@Body() body: { id: number }) {
        return this.schoolsService.deleteSchool(body.id);
    }

    @ApiOperation({ summary: 'Get extra information for a school' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Get('/get-extra-school-info')
    getSchoolInfo(@Query() query: { schoolId: number }) {
        return this.schoolsService.getSchoolExtraInfo(query.schoolId);
    }

    @ApiOperation({ summary: 'Get administrators of a school for the admin table' })
    @UseFirebaseAuth(Roles.SUPERADMIN)
    @Get('/get-schools-admin-table')
    getSchoolsAdminTable(@Query() query: { schoolId: number }) {
        return this.userSchoolService.getAdminsOfSchool(query.schoolId);
    }
}
