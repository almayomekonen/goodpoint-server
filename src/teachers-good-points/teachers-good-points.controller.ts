import { UseFirebaseAuth, FirebaseAuthGuard } from 'src/firebase/firebase-auth.guard';
import { RequestUser } from 'src/firebase/firebase-auth.decorators';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SchoolId } from 'src/common/decorators';
import { PaginationQueryDto } from 'src/common/dtos/get-student-teachers-query-dto.dto';
import { SaveGpTeachersDto } from 'src/common/dtos/save-gp-taechers-dto.dto';
import { AddTeacherReactionDto } from 'src/common/dtos/send-reactiom.dto';
import { Roles } from 'src/common/enums/roles.enum';
import { TeachersGoodPointsGateway } from './teachers-good-points.gateway';
import { TeachersGoodPointsService } from './teachers-good-points.service';

@ApiTags('Teachers Good Points')
@ApiBearerAuth('jwtAuth')
@UseGuards(FirebaseAuthGuard)
@Controller('api/teachers-good-points')
export class TeachersGoodPointsController {
    constructor(
        private teachersGoodPointsService: TeachersGoodPointsService,
        private teachersGpsGateway: TeachersGoodPointsGateway,
    ) {}

    @UseFirebaseAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-gp/:teacherID/:page')
    async getGPByteacherId(
        @Param('teacherID') teacherID: string,
        @Param('page') page: number,
        @RequestUser('id') userId: string,
    ) {
        const good_points = await this.teachersGoodPointsService.goodPointsByTeacherId(teacherID, userId, page);
        return good_points;
    }
    @UseFirebaseAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-count-gp-notView/')
    async getCountGpNotViewByteacherId(@RequestUser('id') userId: string, @SchoolId() schoolId: number) {
        const good_points = await this.teachersGoodPointsService.countGoodPointNotView(userId, schoolId);
        return good_points;
    }

    @UseFirebaseAuth(Roles.ADMIN, Roles.TEACHER)
    @Post('save-gp')
    async saveGpTeachers(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number,
        @Body() saveGpDTO: SaveGpTeachersDto,
    ) {
        const newGp = await this.teachersGoodPointsService.saveTeachersGoodPoint(userId, schoolId, saveGpDTO);
        this.teachersGpsGateway.handleMessage({ receiverId: newGp.receiverId, gpId: newGp.id, schoolId });
        return newGp;
    }

    @UseFirebaseAuth(Roles.TEACHER, Roles.ADMIN)
    @Get('received-good-points')
    getReceivedGPs(
        @RequestUser('id') teacherId: string,
        @SchoolId() schoolId: number,
        @Query() query: PaginationQueryDto,
    ) {
        return this.teachersGoodPointsService.getReceivedGps(teacherId, schoolId, query.perPage, query.pageNumber);
    }

    @UseFirebaseAuth(Roles.TEACHER, Roles.ADMIN)
    @Post('add-reaction')
    async addReaction(@Body() body: AddTeacherReactionDto) {
        return this.teachersGoodPointsService.addReaction(body.gpId, body.reaction);
    }
}
