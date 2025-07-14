import { RequestUser, UseJwtAuth } from '@hilma/auth-nest';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Lang } from 'src/common/decorators';
import { SchoolId } from 'src/common/decorators/schoolIdDecorator.decorator';
import { DeleteGoodPointsDto } from 'src/common/dtos/delete-good-point.dto';
import { PaginationQueryDto } from 'src/common/dtos/get-student-teachers-query-dto.dto';
import { SaveGroupGpDto } from 'src/common/dtos/save-group-gp-dto.dto';
import { Language } from 'src/common/enums';
import { Roles } from 'src/common/enums/roles.enum';
import { SaveGpDto } from '../common/dtos/save-gp-dto.dto';
import { GoodPointService } from './good-point.service';

@ApiTags('Good Points')
@ApiBearerAuth('jwtAuth')
@Controller('api/good-points')
export class GoodPointController {
    constructor(private goodPointService: GoodPointService) {}

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-gp/:studentID/:page')
    async getGPByStudentId(
        @RequestUser('id') userId: string,
        @Param('studentID') studentID: number,
        @SchoolId() schoolId: number,
        @Param('page') page: number,
    ) {
        const good_points = await this.goodPointService.goodPointsByStudentId(studentID, schoolId, userId, page);
        return good_points;
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('save-gp')
    async saveGp(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number,
        @Body() saveGpDTO: SaveGpDto,
        @Lang() lang: Language,
    ) {
        return await this.goodPointService.sendGoodPoint(
            userId,
            schoolId,
            saveGpDTO.studentId,
            saveGpDTO.gpText,
            lang,
            saveGpDTO.openSentenceId,
        );
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('save-group-gp')
    async saveGroupGp(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number,
        @Body() saveGroupGpDto: SaveGroupGpDto,
        @Lang() lang: Language,
    ) {
        return await this.goodPointService.sendGroupGp(
            saveGroupGpDto.studentIds,
            userId,
            schoolId,
            saveGroupGpDto.gpText,
            lang,
        );
    }

    @Get('get-gp-by-link')
    async getGpByLink(@Query('link') link: string) {
        return await this.goodPointService.getGpByLink(link);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-gp-of-student')
    async getStudentGps(@SchoolId() schoolId: number, @Query('studentId') studentId: number) {
        try {
            return await this.goodPointService.getStudentGps(schoolId, studentId);
        } catch (error) {
            console.error(`Error occurred while fetching students for school with ID ${schoolId}: ${error}`);
            throw error;
        }
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('get-teacher-gps')
    async getTeachersGps(@SchoolId() schoolId: number, @Query('teacherId') teacherId: string) {
        try {
            return await this.goodPointService.getTeacherGps(schoolId, teacherId);
        } catch (error) {
            console.error(
                `Error occurred while fetching good points that teacher: ${teacherId} sent in school with ID ${schoolId}: ${error}`,
            );
            throw error;
        }
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Delete('delete-good-point')
    async DeleteGoodPintsById(@Body() body: DeleteGoodPointsDto) {
        if (body.all)
            return await this.goodPointService.deleteGoodPointsExceptById(body.selected, parseInt(body.studentId));
        else return await this.goodPointService.DeleteGoodPointsById(body.selected, parseInt(body.studentId));
    }
    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN)
    @Get('teacher-activity')
    getTeacherSentGps(
        @RequestUser('id') teacherId: string,
        @SchoolId() schoolId: number,
        @Query() query: PaginationQueryDto,
    ) {
        return this.goodPointService.getTeacherSentGps(teacherId, schoolId, query.pageNumber, query.perPage);
    }
}
