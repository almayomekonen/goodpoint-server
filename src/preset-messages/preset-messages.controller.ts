import { RequestUser, UseJwtAuth } from '@hilma/auth-nest';
import { Body, Controller, Delete, Get, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Lang } from 'src/common/decorators/langDecorator.decorator';
import { SchoolId } from 'src/common/decorators/schoolIdDecorator.decorator';
import { AddAPMDTO } from 'src/common/dtos/add-a-pm-dto.dto';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { DeletePMDDTO } from 'src/common/dtos/delete-personal-preset-message-dto.dto';
import { EditPmDto } from 'src/common/dtos/edit-pm.dto';
import { Language } from 'src/common/enums';
import { Roles } from 'src/common/enums/roles.enum';
import { isSuperAdmin } from 'src/common/functions/isSuperAdmin';
import { ExcelPipeResult, ExcelValidatorPipe } from 'src/common/pipes/excel-validator.pipe';
import { PM_HEADERS } from 'src/common/translations/translationObjects';
import { PMAdminTableRow } from 'src/common/types/pm-admin-table-row.type';
import { EXCEL_TYPES } from 'src/common/validators/yup-excel-validator';
import { CustomRequestUserType } from 'src/staff/utils/types';
import { PresetMessagesService } from './preset-messages.service';

@ApiTags('preset-messages')
@ApiBearerAuth('jwtAuth')
@Controller('api/preset-messages')
export class PresetMessagesController {
    constructor(private readonly presetMessagesService: PresetMessagesService) {}

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN, Roles.TEACHER)
    @Get('/get-my-preset-messages')
    getMyPresetMessages(@RequestUser() currUser: CustomRequestUserType, @Lang() lang: Language) {
        return this.presetMessagesService.getMyPresetMessages(currUser.id, currUser.schoolId, lang);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Get('/get-admin-preset-messages')
    getAdminPresetMessages(@RequestUser() currUser: CustomRequestUserType, @Lang() lang: Language) {
        if (isSuperAdmin(currUser.roles))
            return this.presetMessagesService.getSuperAdminPresetMessages(currUser.id, currUser.schoolId, lang);
        else return this.presetMessagesService.getAdminPresetMessages(currUser.id, currUser.schoolId, lang);
    }

    @UseJwtAuth(Roles.SUPERADMIN)
    @Get('/system-preset-messages-list')
    getSystemPresetMessagesList() {
        return this.presetMessagesService.getSystemPresetMessagesList();
    }

    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN)
    @Post('add-a-pm')
    addPresetMessage(@RequestUser() currUser: CustomRequestUserType, @Body() body: AddAPMDTO) {
        return this.presetMessagesService.addPM(currUser.id, { ...body });
    }

    @UseJwtAuth(Roles.ADMIN)
    @Post('add-school-pm')
    addSchoolPM(@Body() body: AddAPMDTO, @RequestUser() currUser: CustomRequestUserType) {
        return this.presetMessagesService.addSchoolPm(currUser.schoolId, { ...body });
    }

    @UseJwtAuth(Roles.SUPERADMIN)
    @Post('add-system-pm')
    addSystemPresetMessage(@Body() body: AddAPMDTO) {
        return this.presetMessagesService.addSystemPresetMessage({ ...body });
    }

    //from the admin table, check if message need to be added as system or school pm
    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Post('add-admin-pm')
    addAdminPM(@Body() body: AddAPMDTO, @RequestUser() currUser: CustomRequestUserType) {
        const isSA = isSuperAdmin(currUser.roles);
        if (isSA) {
            return this.addSystemPresetMessage(body);
        } else {
            return this.addSchoolPM(body, currUser);
        }
    }

    @UseJwtAuth(Roles.ADMIN, Roles.TEACHER, Roles.SUPERADMIN)
    @Get('get-school-preset-messages')
    async getSchoolPM(@Lang() lang: Language, @RequestUser() currUser: CustomRequestUserType) {
        const pms = await this.presetMessagesService.getSchoolPM(currUser.schoolId, currUser.id, lang);
        return pms;
    }

    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN)
    @Delete('delete-personal-preset-message')
    deletePersonalPresetMessage(@Body() body: DeletePMDDTO, @RequestUser() currUser: CustomRequestUserType) {
        return this.presetMessagesService.deletePersonalPresetMessage(body.pmId, currUser.id);
    }

    @UseJwtAuth(Roles.SUPERADMIN)
    @Delete('delete-system-pm')
    deleteSystemPM(@Body() body: DeletePMDDTO) {
        return this.presetMessagesService.deleteSystemPM(body.pmId);
    }

    @UseJwtAuth(Roles.ADMIN)
    @Delete('delete-school-pm')
    deleteSchoolPM(@Body() body: DeletePMDDTO, @RequestUser() currUser: CustomRequestUserType) {
        return this.presetMessagesService.deleteSchoolPM(currUser.schoolId, body.pmId);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Delete('delete-admin-pms')
    deleteAdminPms(
        @Body() body: AdminTableDto<PMAdminTableRow>,
        @RequestUser() currUser: CustomRequestUserType,
        @Lang() lang: Language,
    ) {
        const isSA = isSuperAdmin(currUser.roles);
        if (body.params.allChecked)
            return this.presetMessagesService.deleteAllAdminPMS(
                isSA,
                currUser.schoolId,
                lang,
                body.selected.map(Number),
                body.params,
            );
        else return this.presetMessagesService.deleteAdminPMS(isSA, currUser.schoolId, body.selected.map(Number));
    }

    @UseJwtAuth(Roles.ADMIN)
    @Patch('edit-school-pm')
    editSchoolPM(@Body() body: AddAPMDTO, @RequestUser() currUser: CustomRequestUserType) {
        return this.presetMessagesService.editSchoolPm(body, currUser.schoolId);
    }

    @UseJwtAuth(Roles.ADMIN, Roles.SUPERADMIN)
    @Patch('edit-admin-pm')
    editAdminPM(@Body() body: EditPmDto, @RequestUser() currUser: CustomRequestUserType) {
        return this.presetMessagesService.editAdminPm(body, currUser.schoolId);
    }

    @UseJwtAuth(Roles.TEACHER, Roles.ADMIN, Roles.SUPERADMIN)
    @UseInterceptors(FileInterceptor('FilesHandler'))
    @Post('upload-pm-excel')
    async addPMExcel(
        @UploadedFile(new ExcelValidatorPipe(EXCEL_TYPES.presetMessages)) transformedFile: ExcelPipeResult<PM_HEADERS>,
        @SchoolId() schoolId: number,
    ) {
        return this.presetMessagesService.uploadPMEXCEL(transformedFile.sheet, schoolId);
    }
}
