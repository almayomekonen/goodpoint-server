import { RequestUser, RequestUserType, UseJwtAuth, extractTokenFromCookie } from '@hilma/auth-nest';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Logger,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenService } from 'src/access-token/access-token.service';
import { ClassesService } from 'src/classes/classes.service';
import { Lang } from 'src/common/decorators';
import { SchoolId } from 'src/common/decorators/schoolIdDecorator.decorator';
import { LoginToDifferentSchoolDto } from 'src/common/dtos';
import { AddAdminDto } from 'src/common/dtos/add-admin.dto';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { ChangePasswordDto } from 'src/common/dtos/change-password-dto.dto';
import { ConnectClassToUserDto } from 'src/common/dtos/connect-class-to-user.dto';
import { CreateTeacherReportDto } from 'src/common/dtos/create-teacher-report-dto';
import { DeleteTeacherDto } from 'src/common/dtos/delete-teacher-dto.dto';
import { PaginationQueryDto } from 'src/common/dtos/get-student-teachers-query-dto.dto';
import { NewPasswordDto } from 'src/common/dtos/new-password-dto.dto';
import { SaveTeacherDto } from 'src/common/dtos/save-teacher-dto.tdo';
import { TeacherDetailsDto } from 'src/common/dtos/teachers-details-dto.dto';
import { Language } from 'src/common/enums';
import { RoleIds } from 'src/common/enums/role-ids.enum';
import { Roles } from 'src/common/enums/roles.enum';
import { isSuperAdmin } from 'src/common/functions';
import { ExcelPipeResult, ExcelValidatorPipe } from 'src/common/pipes/excel-validator.pipe';
import { EXCEL_TYPES } from 'src/lib/yup/schemas';
import { TeachersHeaders } from 'src/common/translations/translationObjects';
import { TeacherRow } from 'src/common/types/teacher-row.type';
import { GoodPointService } from 'src/good-point/good-point.service';
import { TeachersGoodPointsService } from 'src/teachers-good-points/teachers-good-points.service';
import { UserSchoolService } from 'src/user-school/user-school.service';
import { StaffService } from './staff.service';
import { CustomRequestUserType } from './utils/types';

@ApiTags('staff')
@Controller('api/staff')
export class StaffController {
    private readonly logger = new Logger(StaffController.name);

    constructor(
        private readonly staffService: StaffService,
        private readonly userSchoolService: UserSchoolService,
        private readonly gpsService: GoodPointService,
        private readonly teachersGpsService: TeachersGoodPointsService,
        private readonly classesService: ClassesService,
        private readonly accessTokenService: AccessTokenService,
    ) {}

    @Post('/login')
    async login(@Body() loginDto: { username: string; password: string }, @Res() res: Response) {
        try {
            this.logger.log(`Login attempt for user: ${loginDto.username}`);

            // Validate credentials using our custom method
            const result = await this.staffService.validateUserCredentials(loginDto.username, loginDto.password);

            if (!result.success) {
                this.logger.log(`Login failed for: ${loginDto.username}, error: ${result.error}`);
                throw new UnauthorizedException({
                    key: 'InvalidCredentials',
                    code: 401,
                    message: result.error || 'Invalid credentials',
                });
            }

            const userInfo = result.user;
            this.logger.log(`Login successful for user: ${userInfo.username}`);

            const isSA = isSuperAdmin(userInfo.roles);
            //first we find the user's school
            const userSchool = await this.userSchoolService.findUserSchoolIds(userInfo.id);

            //if user is not super admin and has no schools , he's not authorized
            if (!userSchool.length && !isSA) {
                throw new UnauthorizedException({
                    key: 'NoUserSchools',
                    code: 403,
                    message: 'User has no schools affiliated with him',
                });
            }
            const { schoolId, roleId } = userSchool[0] || { schoolId: -1, roleId: null };
            const role = Object.keys(RoleIds).find((key) => RoleIds[key] === roleId);

            const body = this.staffService.login(
                {
                    id: userInfo.id,
                    type: userInfo.type,
                    username: userInfo.username,
                    roles: role ? [role] : userInfo.roles,
                    roleKeys: [],
                    schoolId: schoolId ? schoolId : undefined,
                } as RequestUserType,
                res,
            );
            await this.accessTokenService.saveAccessToken(body[process.env.ACCESS_TOKEN_NAME], body.id, schoolId);
            res.send(body);
        } catch (error) {
            this.logger.error('Login error:', error);
            throw error;
        }
    }

    @UseJwtAuth(Roles.SUPERADMIN, Roles.ADMIN, Roles.TEACHER)
    @Post('/login-to-different-school')
    async loginToDifferentSchool(
        @RequestUser() userInfo: RequestUserType & { exp: number },
        @Body() school: LoginToDifferentSchoolDto,
        @Res() res: Response,
    ) {
        const now = new Date();
        const date = new Date(now.getTime() / 1e3).getTime();
        const ttl = userInfo.exp - date;
        const userSchool = await this.userSchoolService.findUserSchoolIds(userInfo.id);
        const { schoolId, roleId } = userSchool.find((val) => val.schoolId === school.schoolId);
        if (!schoolId) return;
        const role = Object.keys(RoleIds).find((key) => RoleIds[key] === roleId);

        const body = this.staffService.login(
            {
                id: userInfo.id,
                type: userInfo.type,
                username: userInfo.username,
                roles: [role],
                roleKeys: [],
                schoolId: schoolId ? schoolId : undefined,
            } as RequestUserType,
            res,
            ttl,
        );

        await this.accessTokenService.removeAccessToken(body[process.env.ACCESS_TOKEN_NAME]);
        await this.accessTokenService.saveAccessToken(body[process.env.ACCESS_TOKEN_NAME], body.id, schoolId);

        res.send(body);
    }

    @UseJwtAuth(Roles.SUPERADMIN, Roles.ADMIN, Roles.TEACHER)
    @Post('/logout')
    async logout(@Req() req: any) {
        const accessTokenFetcher = extractTokenFromCookie(process.env.ACCESS_TOKEN_NAME, false);

        const accessToken: string = accessTokenFetcher(req);

        try {
            await this.accessTokenService.removeAccessToken(accessToken);
            return { message: 'Logout successful' };
        } catch (error) {
            throw new HttpException('Logout failed', 500);
        }
    }

    @UseJwtAuth(Roles.SUPERADMIN, Roles.ADMIN, Roles.TEACHER)
    @Get('/full-name')
    async getFullName(@RequestUser() currUser: RequestUserType) {
        const name = await this.staffService.getFullName(currUser.id);
        return name;
    }

    // Debug endpoint - no authentication required
    @Get('/debug/auth-test')
    async debugAuthTest() {
        this.logger.log('Debug auth test endpoint called');
        return {
            message: 'Debug endpoint working',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            accessTokenName: process.env.ACCESS_TOKEN_NAME,
        };
    }

    @Get('debug/env-check')
    async debugEnvCheck() {
        return {
            message: 'Environment variables check',
            nodeEnv: process.env.NODE_ENV,
            accessTokenName: process.env.ACCESS_TOKEN_NAME,
            twoFactorTokenCookie: process.env.TWO_FACTOR_TOKEN_COOKIE,
            secretOrKeyExists: !!process.env.SECRET_OR_KEY,
            secretOrKeyLength: process.env.SECRET_OR_KEY?.length || 0,
            dbHost: process.env.DB_HOST,
            dbName: process.env.DB_NAME,
            dbSsl: process.env.DB_SSL,
            dbSync: process.env.DB_SYNCHRONIZE,
            clientDomain: process.env.CLIENT_DOMAIN,
            serverDomain: process.env.SERVER_DOMAIN,
            port: process.env.PORT,
        };
    }

    // Test endpoint to manually check user authentication
    @Post('/debug/test-login')
    async testLogin(@Body() body: { username: string; password: string }) {
        this.logger.log(`Manual login test for: ${body.username}`);

        try {
            // This will help us see if the user exists and password validation works
            const result = await this.staffService.validateUserCredentials(body.username, body.password);
            return {
                success: true,
                user: result,
                message: 'Login validation successful',
            };
        } catch (error) {
            this.logger.error(`Login validation failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                message: 'Login validation failed',
            };
        }
    }

    // Test endpoint that simulates the login process without authentication guard
    @Post('/debug/test-login-process')
    async testLoginProcess(@Body() body: { username: string; password: string }) {
        this.logger.log(`Testing login process for: ${body.username}`);

        try {
            // Step 1: Validate credentials
            const validationResult = await this.staffService.validateUserCredentials(body.username, body.password);

            if (!validationResult.success) {
                return {
                    success: false,
                    error: validationResult.error,
                    step: 'credential_validation',
                };
            }

            const user = validationResult.user.user;
            this.logger.log(`User validated: ${user.username}, ID: ${user.id}, Type: ${user.type}`);

            // Step 2: Find user's school
            const userSchool = await this.userSchoolService.findUserSchoolIds(user.id);
            this.logger.log(`User schools:`, JSON.stringify(userSchool, null, 2));

            if (!userSchool.length) {
                return {
                    success: false,
                    error: 'User has no schools affiliated',
                    step: 'school_validation',
                };
            }

            // Step 3: Check if user is super admin
            const isSA = user.roles.some((role) => role.name === 'Super Admin');
            this.logger.log(`Is super admin: ${isSA}`);

            if (!userSchool.length && !isSA) {
                return {
                    success: false,
                    error: 'User has no schools and is not super admin',
                    step: 'authorization_check',
                };
            }

            const { schoolId, roleId } = userSchool[0] || { schoolId: -1, roleId: null };
            this.logger.log(`Selected school: ${schoolId}, role: ${roleId}`);

            return {
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    type: user.type,
                    roles: user.roles,
                    schoolId: schoolId,
                    roleId: roleId,
                },
                message: 'Login process completed successfully',
            };
        } catch (error) {
            this.logger.error(`Login process failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                step: 'exception',
            };
        }
    }

    @Get('debug/direct-user-check/:username')
    async debugDirectUserCheck(@Param('username') username: string) {
        try {
            // Query user directly from database
            const user = await this.staffService.findUserDirectly(username);

            return {
                message: 'Direct user check',
                userFound: !!user,
                userId: user?.id,
                username: user?.username,
                hasPassword: !!user?.password,
                passwordLength: user?.password?.length || 0,
                passwordStart: user?.password?.substring(0, 10) || 'N/A',
                type: user?.type,
            };
        } catch (error) {
            return {
                message: 'Error in direct user check',
                error: error.message,
            };
        }
    }

    @Get('debug/raw-password-check/:username')
    async debugRawPasswordCheck(@Param('username') username: string) {
        try {
            // Query user using raw SQL
            const user = await this.staffService.testRawPasswordQuery(username);

            return {
                message: 'Raw password check',
                userFound: !!user,
                userId: user?.id,
                username: user?.username,
                hasPassword: !!user?.password,
                passwordLength: user?.password?.length || 0,
                passwordStart: user?.password?.substring(0, 10) || 'N/A',
                type: user?.type,
            };
        } catch (error) {
            return {
                message: 'Error in raw password check',
                error: error.message,
            };
        }
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('is-first-login')
    isFirstLogin(@RequestUser() currUser: CustomRequestUserType) {
        return this.staffService.isFirstLogin(currUser.id, false);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('is-first-admin-login')
    isFirstAdminLogin(@RequestUser() currUser: CustomRequestUserType) {
        return this.staffService.isFirstLogin(currUser.id, true);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('admin-get-teachers')
    async adminGetTeachers(@RequestUser('id') userId: string, @SchoolId() schoolId: number) {
        const users = await this.staffService.adminGetTeachers(userId, schoolId);
        return users;
    }

    @UseJwtAuth(Roles.ADMIN)
    @Get('get-teachers-of-school')
    async getTeachersOfSchool(@SchoolId() schoolId: number) {
        const users = await this.staffService.getTeachersOfSchool(schoolId);
        return users;
    }
    @UseJwtAuth(Roles.ADMIN)
    @Get('get-teacher/:id')
    async getTeacherById(@Param('id') id: string, @SchoolId() schoolId: number) {
        try {
            const teacher = await this.staffService.getTeacherById(id, schoolId);
            return teacher;
        } catch (error) {
            this.logger.error(`failed to get teacher error: ${error.message}.`);
            throw new NotFoundException('Teacher not found.');
        }
    }

    @UseJwtAuth(Roles.ADMIN)
    @Delete('delete-teacher-lm134rfdn')
    deleteTeacher(@Body() body: DeleteTeacherDto, @SchoolId() schoolId: number) {
        return this.staffService.deleteTeacher(body.teacherId, schoolId);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Delete('delete-teachers')
    async DeleteStudentsById(@SchoolId() schoolId: number, @Body() body: AdminTableDto<TeacherRow>) {
        if (body.params.allChecked) {
            return await this.staffService.deleteTeachersExceptById(body, schoolId);
        } else {
            return await this.staffService.deleteTeachersById(body.selected, schoolId);
        }
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-teacher')
    async getTeachers(@RequestUser('id') userId: string, @SchoolId() schoolId: number) {
        const teachers = await this.staffService.teacherGetTeachers(userId, schoolId);
        return teachers;
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('get-teachers-of-school-admin')
    getAdminTeachers(@SchoolId() schoolId: number) {
        return this.staffService.getAdminTeachers(schoolId);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Get('get-user-data')
    getUserDataForContext(@RequestUser('id') userId: string, @SchoolId() schoolId: number) {
        return this.staffService.getContextData(userId, schoolId);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Post('add-remove-class-from-user')
    async connectClassToUser(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number,
        @Body() body: ConnectClassToUserDto,
    ) {
        return this.staffService.addOrRemoveClassFromUser(body.classId, userId, schoolId, body.action);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Post('add-remove-study-group-from-user')
    removeStudyGroupFromUser(
        @RequestUser('id') userId: string,
        @SchoolId() schoolId: number,
        @Body() body: ConnectClassToUserDto,
    ) {
        return this.staffService.addOrRemoveStudyGroupFromUser(body.classId, userId, schoolId, body.action);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Put('update-system-notifications')
    async updateSystemNotifications(
        @RequestUser('id') userId: string,
        @Body('systemNotifications') systemNotifications: boolean,
    ) {
        return await this.staffService.updateSystemNotifications(userId, systemNotifications);
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Put('update-details')
    async updateDetails(@RequestUser('id') userId: string, @Body() teacherDetailsDto: TeacherDetailsDto) {
        return await this.staffService.updateTeacherDetails(userId, teacherDetailsDto);
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Put('update-preferred-language')
    async updatePreferredLanguage(
        @RequestUser('id') userId: string,
        @Body('preferredLanguage') preferredLanguage: Language,
    ) {
        return await this.staffService.updatePreferredLanguage(userId, preferredLanguage);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('teacher-activity/students')
    async getTeacherActivity(
        @RequestUser('id') teacherId: string,
        @SchoolId() schoolId: number,
        @Query() query: PaginationQueryDto,
    ) {
        return this.gpsService.getTeacherSentGps(teacherId, schoolId, query.pageNumber, query.perPage);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Get('teacher-activity/teachers')
    async getTeacherActivityTeachers(
        @RequestUser('id') teacherId: string,
        @SchoolId() schoolId: number,
        @Query() query: PaginationQueryDto,
    ) {
        return this.teachersGpsService.getTeacherActivity(teacherId, schoolId, query.pageNumber, query.perPage);
    }

    @Get('password-reset/:email')
    async passwordReset(@Param('email') email: string, @Lang() lang: Language) {
        return await this.staffService.passwordReset(email, lang);
    }
    @Put('new-password')
    async saveNewPassword(@Body() newPasswordDto: NewPasswordDto) {
        return await this.staffService.changePasswordWithToken(
            newPasswordDto.token,
            newPasswordDto.email,
            newPasswordDto.password,
        );
    }
    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER)
    @Put('change-password')
    async changePassword(@RequestUser('id') userId: string, @Body() changePasswordDto: ChangePasswordDto) {
        return await this.staffService.changePassword(
            userId,
            changePasswordDto.currentPassword,
            changePasswordDto.password,
            true,
        );
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Post('add-teacher')
    async addTeacher(
        @SchoolId() schoolId: number,
        @Body() body: SaveTeacherDto,
        @Lang() lang: Language,
    ): Promise<{ password: string | null }> {
        return await this.staffService.saveTeacher(body, schoolId, lang);
    }

    @UseJwtAuth(Roles.SUPERADMIN)
    @Post('add-admin')
    async addAdmin(@Body() body: AddAdminDto, @Lang() lang: Language) {
        return await this.staffService.saveAdmin(body, lang);
    }

    @UseJwtAuth(Roles.SUPERADMIN)
    @Delete('delete-admin')
    async deleteAdmin(@Body() body: { adminId: string; schoolId: number }) {
        await this.classesService.detachUserFromClasses(body.adminId, body.schoolId);
        return this.userSchoolService.removeAdmin(body.schoolId, body.adminId);
    }
    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN, Roles.SUPERADMIN)
    @UseInterceptors(FileInterceptor('FilesHandler'))
    @Post('upload-teacher-excel')
    async addTeachersExcel(
        @UploadedFile(new ExcelValidatorPipe(EXCEL_TYPES.teachers)) transformedFile: ExcelPipeResult<TeachersHeaders>,
        @SchoolId() schoolId: number,
    ) {
        const { updated, newRecords, buffer } = await this.staffService.uploadTeachersEXCEL(
            transformedFile.sheet,
            schoolId,
        );
        return { buffer, updated, newRecords };
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Put('reset-password-by-admin/:id')
    async resetPasswordByAdmin(@Param('id') id: string, @Lang() lang: Language) {
        return await this.staffService.newPassword(id, lang);
    }
    @UseJwtAuth(Roles.ADMIN)
    @Post('edit-teacher-by-admin/:id')
    async editTeacherByAdmin(@Param('id') id: string, @Body() body: SaveTeacherDto, @SchoolId() schoolId: number) {
        return await this.staffService.updateTeacherDetailsByAdmin(id, body, schoolId);
    }

    @Post('create-teacher-report-xlsx')
    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    async createTeacherReportXlsx(
        @SchoolId() schoolId: number,
        @Body() body: CreateTeacherReportDto,
        @Lang() lang: Language,
        @Res() res: Response,
    ) {
        const buffer = await this.staffService.createTeacherReportXlsx(schoolId, body.teacherId, body.dates, lang);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }

    @Post('admin-teachers-report')
    @UseJwtAuth(Roles.ADMIN)
    async createAdminTeachersReport(
        @SchoolId() schoolId: number,
        @Body() body: Pick<CreateTeacherReportDto, 'dates'>,
        @Lang() lang: Language,
        @Res() res: Response,
    ) {
        const buffer = await this.staffService.createAdminTeachersReport(schoolId, body.dates, lang);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    }

    @Post('debug/simple-login')
    async debugSimpleLogin(@Body() loginDto: { username: string; password: string }, @Res() res: Response) {
        try {
            this.logger.log(`Simple login attempt for: ${loginDto.username}`);

            // Validate credentials using our custom method
            const result = await this.staffService.validateUserCredentials(loginDto.username, loginDto.password);

            if (result.success) {
                this.logger.log(`Simple login successful for: ${loginDto.username}`);
                return res.json({
                    success: true,
                    message: 'Login successful',
                    user: result.user,
                });
            } else {
                this.logger.log(`Simple login failed for: ${loginDto.username}, error: ${result.error}`);
                return res.status(401).json({
                    success: false,
                    message: result.error,
                });
            }
        } catch (error) {
            this.logger.error('Error in simple login:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message,
            });
        }
    }

    @Post('debug/generate-hash')
    async debugGenerateHash(@Body() body: { password: string }) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash(body.password, 10);
        const isValid = await bcrypt.compare(body.password, hash);

        return {
            message: 'Hash generated in production environment',
            password: body.password,
            hash: hash,
            isValid: isValid,
            bcryptVersion: bcrypt.version || 'unknown',
        };
    }

    @Post('debug/test-password-retrieval')
    async debugTestPasswordRetrieval(@Body() body: { username: string; password: string }) {
        try {
            // Get user from database
            const user = await this.staffService.findUserDirectly(body.username);

            if (!user) {
                return { success: false, error: 'User not found' };
            }

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const bcrypt = require('bcrypt');

            // Test password comparison
            const syncResult = bcrypt.compareSync(body.password, user.password);
            const asyncResult = await bcrypt.compare(body.password, user.password);

            return {
                message: 'Password retrieval test',
                username: user.username,
                hasPassword: !!user.password,
                passwordLength: user.password?.length || 0,
                passwordStart: user.password?.substring(0, 15) || 'N/A',
                inputPassword: body.password,
                syncResult: syncResult,
                asyncResult: asyncResult,
                passwordsMatch: syncResult === asyncResult,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
