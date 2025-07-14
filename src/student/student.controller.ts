import { UseJwtAuth } from '@hilma/auth-nest';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Lang, SchoolId } from 'src/common/decorators';
import { StudentByClassParams } from 'src/common/dtos';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { CreateStudentsReportDto } from 'src/common/dtos/create-students-report-dto.dto';
import { MoveStudentsDto } from 'src/common/dtos/move-students-dto';
import { SaveStudentDto } from 'src/common/dtos/save-student-dto.dto';
import { Language, SchoolGrades } from 'src/common/enums';
import { Roles } from 'src/common/enums/roles.enum';
import { ExcelPipeResult, ExcelValidatorPipe } from 'src/common/pipes/excel-validator.pipe';
import { StudentHeaders } from 'src/common/translations/translationObjects';
import { StudentRow } from 'src/common/types/student-row.type';
import { EXCEL_TYPES } from 'src/lib/yup/schemas';
import { StudentService } from './student.service';

@ApiTags('student')
@ApiBearerAuth('jwtAuth')
@Controller('api/student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-student-by-id/:id')
    async getStudentById(@Param('id') params: number) {
        const student = await this.studentService.getStudentById(params);
        if (!student) {
            throw new NotFoundException('Student not found.');
        }
        return student;
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-students/:grade/:classIndex')
    async getStudentsByClass(@SchoolId() schoolId: number, @Param() params: StudentByClassParams) {
        const students = await this.studentService.studentsByClass(schoolId, params);
        return students;
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-students-by-study-group/:id/')
    async getStudentsByStudyGroup(@SchoolId() schoolId: number, @Param('id') studyGroupId: number) {
        if (!Number(studyGroupId)) {
            throw new BadRequestException('no studyGroupId');
        }
        const students = await this.studentService.studentsByStudyGroup(schoolId, studyGroupId);
        return students;
    }
    @UseJwtAuth(Roles.ADMIN)
    @Get('get-students-by-grades')
    async getStudentsByGrades(@SchoolId() schoolId: number, @Query() params: { grades: SchoolGrades[] }) {
        const students = await this.studentService.getStudentsByGrades(schoolId, params.grades);
        return students;
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('get-students-ids-of-studyGroup/:id')
    async getStudentsIdsOfStudyGroup(@Param('id') studyGroupId: number) {
        const students = await this.studentService.getStudentsIdsOfStudyGroup(studyGroupId);
        return students;
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('get-admin-students-by-studyGroup/:id')
    async getAdminStudentsByStudyGroup(@SchoolId() schoolId: number, @Param('id') studyGroupId: number) {
        if (!Number(studyGroupId)) {
            throw new BadRequestException('no studyGroupId');
        }
        const students = await this.studentService.getAdminStudentsByStudyGroup(schoolId, studyGroupId);
        return students;
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('get-admin-students-by-class/:id/')
    async getAdminStudentByClass(@SchoolId() schoolId: number, @Param('id') classId: number) {
        if (!Number(classId)) {
            throw new BadRequestException('no classId');
        }
        const students = await this.studentService.getAdminStudentByClass(schoolId, classId);
        return students;
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Post('add-student')
    async addStudents(@SchoolId() schoolId: number, @Body() body: SaveStudentDto) {
        await this.studentService.saveStudent(body.id, body, schoolId);
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('edit-student')
    async editStudents(@SchoolId() schoolId: number, @Body() body: SaveStudentDto) {
        return await this.studentService.saveStudent(body.id, body, schoolId);
    }
    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Delete('delete-students')
    async DeleteStudentsById(@SchoolId() schoolId: number, @Body() body: AdminTableDto<StudentRow>) {
        if (body.params.allChecked)
            return await this.studentService.deleteStudentsExceptById(
                body.selected,
                body.params.userSearch,
                body.params.filters,
                schoolId,
            );
        else return await this.studentService.deleteStudentsById(body.selected);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Post('move-students')
    async moveStudentsById(@SchoolId() schoolId: number, @Body('data') body: MoveStudentsDto) {
        let affected;
        if (body.params.allChecked) {
            affected = await this.studentService.moveStudentsExceptById(
                body,
                schoolId,
                body.grade as SchoolGrades,
                body.classIndex,
            );
        } else {
            affected = await this.studentService.moveStudentsById(
                body.selected,
                body.grade as SchoolGrades,
                body.classIndex,
                schoolId,
            );
        }
        return affected;
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-students-report/:classId')
    studentsByClassId(@SchoolId() schoolId: number, @Param('classId') classId: number) {
        return this.studentService.studentsByClassId(schoolId, classId);
    }

    @Post('create-students-report-xlsx')
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    async createStudentsReportXlsx(
        @SchoolId() schoolId: number,
        @Body() body: CreateStudentsReportDto,
        @Lang() lang: Language,
        @Res() res: Response,
    ) {
        const buffer = await this.studentService.createStudentsReportXlsx(
            schoolId,
            body.classId,
            body.studentsIds,
            body.dates,
            lang,
            body.allStudents,
        );
        if (body.email) {
            await this.studentService.SendMailStudentsReportXlsx(body.email, body.classId, lang, buffer);
            res.send('Success');
        } else {
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.set('Content-Disposition', 'attachment; filename=example.xlsx');
            res.send(buffer);
        }
    }
    @Post('create-students-report-pdf')
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    async createStudentsReportPdf(
        @SchoolId() schoolId: number,
        @Body() body: CreateStudentsReportDto,
        @Lang() lang: Language,
        @Res() res: Response,
    ) {
        const studentsAndBuffers = await this.studentService.createStudentsReportPdf(
            schoolId,
            body.classId,
            body.studentsIds,
            body.dates,
            lang,
            body.allStudents,
        );

        if (studentsAndBuffers.length === 0) {
            throw new NotFoundException('No students or buffers found for the given parameters.');
        }

        if (body.email) {
            await this.studentService.SendMailStudentsReportPdf(body.email, body.classId, lang, studentsAndBuffers);
            return res.status(204).end();
        }

        if (studentsAndBuffers.length === 1 && studentsAndBuffers[0].length === 1) {
            const [student] = studentsAndBuffers[0];
            res.setHeader('Content-Type', 'application/pdf');
            return res.send(student.buffer);
        }

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="students_report.zip"');
        const content = await this.studentService.generateZipArchive(studentsAndBuffers, lang);
        return res.send(content);
    }

    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN, Roles.SUPERADMIN)
    @UseInterceptors(FileInterceptor('FilesHandler'))
    @Post('upload-Students-excel')
    async addStudentsExcel(
        @UploadedFile(new ExcelValidatorPipe(EXCEL_TYPES.students)) transformedFile: ExcelPipeResult<StudentHeaders>,
        @SchoolId() schoolId: number,
    ) {
        return this.studentService.uploadStudentsEXCEL(transformedFile.sheet, schoolId);
    }
}
