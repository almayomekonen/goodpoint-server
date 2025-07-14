import { UseJwtAuth } from '@hilma/auth-nest';
import { Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Lang } from 'src/common/decorators';
import { SchoolId } from 'src/common/decorators/schoolIdDecorator.decorator';
import { AdminAddOrEditClassFormDto } from 'src/common/dtos';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { CreateClassReportDto } from 'src/common/dtos/create-class-report.dto';
import { FileUploadDto } from 'src/common/dtos/file-upload-dto.dto';
import { HomeTeacherDto } from 'src/common/dtos/home-teacher-dto.dto';
import { Language } from 'src/common/enums';
import { Roles } from 'src/common/enums/roles.enum';
import { ExcelPipeResult, ExcelValidatorPipe } from 'src/common/pipes/excel-validator.pipe';
import { ClassesHeaders } from 'src/common/translations/translationObjects';
import { ClassesTableRow } from 'src/common/types/classes-table-row.type';
import { EXCEL_TYPES } from 'src/common/validators/yup-excel-validator';
import { ClassesService } from './classes.service';

@ApiTags('classes')
@ApiBearerAuth('jwtAuth')
@Controller('api/classes')
export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}

    @ApiOperation({ summary: 'Fetch classes' })
    @ApiOkResponse({ description: 'Classes fetched successfully.' })
    @UseJwtAuth(Roles.SUPERADMIN, Roles.ADMIN, Roles.TEACHER)
    @Get('/fetch-classes')
    getClassesOfSchool(@SchoolId() schoolId: number) {
        return this.classesService.fetchClasses(schoolId);
    }

    @ApiOperation({ summary: 'Admin fetch classes' })
    @ApiOkResponse({ description: 'Classes fetched successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Get('/admin-fetch-classes')
    async getClassesOfSchoolAdmin(@SchoolId() SchoolId: number) {
        return await this.classesService.adminFetchAllClasses(SchoolId);
    }

    @ApiOperation({ summary: 'Admin fetch class details' })
    @ApiOkResponse({ description: 'Class details fetched successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Get('/admin-fetch-class/:id')
    async getClassDetails(@Param('id') id: number, @SchoolId() SchoolId: number) {
        return await this.classesService.getClassDetails(id, SchoolId);
    }

    @ApiOperation({ summary: 'Admin add classes' })
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ description: 'Classes added successfully.' })
    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @Post('admin-add-classes')
    async adminAddClasses(
        @UploadedFile(new ExcelValidatorPipe(EXCEL_TYPES.classes))
        transformedFile: ExcelPipeResult<ClassesHeaders>,
        @SchoolId() schoolId: number,
    ) {
        const newClasses = await this.classesService.adminAddClasses(
            transformedFile.sheet,
            transformedFile.headerLang,
            schoolId,
        );
        return newClasses;
    }

    @ApiOperation({ summary: 'Admin add or edit class form' })
    @ApiCreatedResponse({ description: 'Class form added or edited successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Post('admin-add-or-edit-class-form')
    async adminAddClassForm(@Body() body: AdminAddOrEditClassFormDto, @SchoolId() schoolId: number) {
        return this.classesService.adminAddOrEditClassForm({ ...body, schoolId });
    }

    @ApiOperation({ summary: 'Create class report XLSX' })
    @ApiResponse({ status: 200, description: 'Class report created successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Post('create-class-report-xlsx')
    async createStudentsReportXlsx(
        @SchoolId() schoolId: number,
        @Body() body: CreateClassReportDto,
        @Lang() lang: Language,
        @Res() res: Response,
    ) {
        const buffer = await this.classesService.createClassesReportXlsx(schoolId, body.classId, body.dates, lang);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.set('Content-Disposition', 'attachment; filename=example.xlsx');
        res.send(buffer);
    }

    @ApiOperation({ summary: 'Assign home teacher' })
    @ApiResponse({ status: 200, description: 'Home teacher assigned successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Post('assign-home-teacher')
    assignHomeTeacher(@Body() body: HomeTeacherDto, @SchoolId() schoolId: number) {
        return this.classesService.assignHomeTeacher(
            { grade: body.grade, classIndex: body.classIndex },
            { lastName: body.lastName, firstName: body.firstName },
            schoolId,
        );
    }

    @ApiOperation({ summary: 'Get all school classes' })
    @ApiOkResponse({ description: 'All school classes fetched successfully.' })
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Get('get-all-school-classes')
    getAllSchoolClasses(@SchoolId() schoolId: number) {
        return this.classesService.getAllSchoolClasses(schoolId);
    }

    @ApiOperation({ summary: 'Get populated school classes' })
    @ApiOkResponse({ description: 'Populated school classes fetched successfully.' })
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-populated-school-classes')
    getPopulatedSchoolClasses(@SchoolId() schoolId: number) {
        return this.classesService.getPopulatedSchoolClasses(schoolId);
    }

    @ApiOperation({ summary: 'Delete admin classes' })
    @ApiOkResponse({ description: 'Admin classes deleted successfully.' })
    @UseJwtAuth(Roles.ADMIN)
    @Delete('delete-admin-classes')
    deleteAdminClasses(@Body() body: AdminTableDto<ClassesTableRow>, @SchoolId() schoolId: number) {
        return this.classesService.deleteAdminClasses(body, schoolId);
    }

    @ApiOperation({ summary: 'Upload classes Excel' })
    @ApiResponse({ status: 200, description: 'Classes uploaded successfully.' })
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @UseInterceptors(FileInterceptor('FilesHandler'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'classes excel file',
        type: FileUploadDto,
    })
    @Post('upload-classes-excel')
    async addClassesExcel(
        @UploadedFile(new ExcelValidatorPipe(EXCEL_TYPES.classes)) transformedFile: ExcelPipeResult<ClassesHeaders>,
        @SchoolId() schoolId: number,
    ) {
        return this.classesService.uploadClassesEXCEL(transformedFile.sheet, schoolId);
    }
}
