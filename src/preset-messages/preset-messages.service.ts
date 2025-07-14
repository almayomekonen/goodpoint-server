import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionParams } from 'src/common/dtos/action-params-dto';
import { Language } from 'src/common/enums';
import { detectLang } from 'src/common/functions/detect-lang';
import { translateGender, translatePresetCategory } from 'src/common/functions/hebrew-excel-translations';
import { ExcelSheet } from 'src/common/pipes/excel-validator.pipe';
import { PM_HEADERS } from 'src/common/translations/translationObjects';
import { PMAdminTableRow } from 'src/common/types/pm-admin-table-row.type';
import { GoodPointsPreset, PresetMessages, RemovedPresetMessages } from 'src/entities';
import { GoodPointsPresetService } from 'src/good-points-preset/good-points-preset.service';
import { RemovedPresetMessagesService } from 'src/removed-preset-messages/removed-preset-messages.service';
import { Brackets, FindOptionsWhere, Repository } from 'typeorm';
@Injectable()
export class PresetMessagesService {
    private readonly logger = new Logger(PresetMessagesService.name);
    constructor(
        @InjectRepository(PresetMessages) private presetMessagesRepository: Repository<PresetMessages>,
        @InjectRepository(RemovedPresetMessages)
        private removedPresetMessagesRepository: Repository<RemovedPresetMessages>,
        private gpPresetService: GoodPointsPresetService,
        private removedPMSService: RemovedPresetMessagesService,
    ) {}

    async getMyPresetMessages(userId: string, schoolId: number, lang: string) {
        const removedPresetMessages = this.removedPresetMessagesRepository
            .createQueryBuilder('rpm')
            .select('rpm.preset_message_id')
            .where('teacher_id=:teacherId')
            .orWhere('school_id=:schoolId');

        const messages = await this.presetMessagesRepository
            .createQueryBuilder('pm')
            .where(
                new Brackets((qb) => {
                    qb.where('creator_id IS NULL AND school_id=:schoolId', { schoolId })
                        .orWhere('creator_id IS NULL AND school_id IS NULL')
                        .orWhere('creator_id=:id');
                }),
            )
            .andWhere('lang=:lang', { lang })
            .andWhere(`pm.id NOT IN (${removedPresetMessages.getQuery()})`)
            .orderBy('created', 'DESC')
            .setParameter('teacherId', userId)
            .setParameter('id', userId)
            .distinct(true)
            .getMany();
        return messages;
    }

    async getAdminPresetMessages(userId: string, schoolId: number, lang: string) {
        const removedPresetMessages = this.removedPresetMessagesRepository
            .createQueryBuilder('rpm')
            .select('rpm.preset_message_id')
            .where('teacher_id=:teacherId')
            .orWhere('school_id=:schoolId');

        const messages = await this.presetMessagesRepository
            .createQueryBuilder('pm')
            .select([
                'pm.id AS id',
                'COUNT(gpp.presetMessageId) AS numOfUses',
                'pm.creator_id AS creatorId',
                'pm.school_id AS schoolId',
                'pm.created AS created',
                'pm.text AS text',
                'pm.gender AS gender',
                'pm.presetCategory AS presetCategory',
            ])
            .where(
                new Brackets((qb) => {
                    qb.where('creator_id IS NULL AND pm.school_id=:schoolId').orWhere(
                        'creator_id IS NULL AND pm.school_id IS NULL',
                    );
                }),
            )
            .leftJoin(GoodPointsPreset, 'gpp', 'gpp.presetMessageId = pm.id AND gpp.schoolId = :schoolId')
            .andWhere('lang=:lang', { lang })
            .andWhere(`pm.id NOT IN (${removedPresetMessages.getQuery()})`)
            .orderBy('created', 'DESC')
            .groupBy('pm.id')
            .setParameter('teacherId', userId)
            .setParameter('id', userId)
            .setParameter('schoolId', schoolId)
            .distinct(true)
            .getRawMany();
        return messages;
    }

    async getSuperAdminPresetMessages(userId: string, schoolId: number, lang: string) {
        return await this.presetMessagesRepository
            .createQueryBuilder('pm')
            .select([
                'pm.id AS id',
                'COUNT(gpp.presetMessageId) AS numOfUses',
                'pm.creator_id AS creatorId',
                'pm.school_id AS schoolId',
                'pm.created AS created',
                'pm.text AS text',
                'pm.gender AS gender',
                'pm.presetCategory AS presetCategory',
            ])
            .where('creator_id IS NULL AND pm.school_id IS NULL')
            .leftJoin(GoodPointsPreset, 'gpp', 'gpp.presetMessageId = pm.id AND gpp.schoolId = :schoolId')
            .andWhere('lang=:lang', { lang })
            .orderBy('created', 'DESC')
            .groupBy('pm.id')
            .setParameter('teacherId', userId)
            .setParameter('id', userId)
            .setParameter('schoolId', schoolId)
            .distinct(true)
            .getRawMany();
    }

    getSystemPresetMessagesList() {
        return this.presetMessagesRepository.findBy({ creator: null });
    }

    async addPM(currUserId: string, pmInfo: Partial<PresetMessages>) {
        const pmLang = detectLang(pmInfo.text);
        return this.presetMessagesRepository.save({ creatorId: currUserId, ...pmInfo, lang: pmLang });
    }

    async addSchoolPm(schoolId: number, pmInfo: Partial<PresetMessages>) {
        const pmLang = detectLang(pmInfo.text);
        return this.presetMessagesRepository.save({ schoolId: schoolId, ...pmInfo, lang: pmLang });
    }

    async getSchoolPM(
        schoolId: number,
        currUserId: string,
        lang: Language,
    ): Promise<(Partial<PresetMessages> & { countpresetMessageId: string })[]> {
        return this.presetMessagesRepository
            .createQueryBuilder('pm')
            .select([
                'pm.id AS id',
                'pm.text AS text',
                'preset_category AS presetCategory',
                'pm.gender AS gender',
                'pm.lang AS lang',
                'pm.school_id AS schoolId',
                'gp_preset.countpresetMessageId',
            ])
            .where('(creator_id IS NULL AND school_id=:schoolId)')
            .orWhere('creator_id IS NULL AND school_id IS NULL')
            .andWhere('lang=:lang', { lang: lang })
            .leftJoinAndSelect(
                (qb) =>
                    qb
                        .select(['preset_message_id', 'count(preset_message_id) AS countpresetMessageId'])
                        .from(GoodPointsPreset, 'gpp')
                        .where('gpp.schoolId=:schoolId')
                        .groupBy('gpp.preset_message_id'),
                'gp_preset',
                'gp_preset.preset_message_id=pm.id',
            )
            .distinct(true)
            .setParameter('schoolId', schoolId)
            .getRawMany();
    }

    async addSystemPresetMessage(pmInfo: Partial<PresetMessages>): Promise<PresetMessages> {
        const pmLang = detectLang(pmInfo.text);
        return this.presetMessagesRepository.save({ ...pmInfo, creatorId: null, lang: pmLang });
    }

    async deletePersonalPresetMessage(pmId: number, currUserId: string) {
        const pmToDelete = await this.presetMessagesRepository.findOneBy({ id: pmId });
        //checking if pm doesn't exist
        if (!pmToDelete) throw new NotFoundException('preset message not found ');
        //checking if the pm is a system pm
        if (!pmToDelete.creatorId) {
            //meaning we add it to removedPresetMessages table
            const removedPM = await this.removedPMSService.addRemovedPM({
                teacherId: currUserId,
                presetMessageId: pmId,
            });
            return removedPM;
        } else {
            return this.presetMessagesRepository.delete([pmId]);
        }
    }

    async deleteSystemPM(pmId: number) {
        await this.gpPresetService.deleteGPPByPMID(pmId);
        return this.presetMessagesRepository.delete([pmId]);
    }

    async deleteSchoolPM(schoolId: number, pmId: number) {
        const message = await this.presetMessagesRepository.findOneBy({
            id: pmId,
            schoolId: schoolId,
            creatorId: null,
        });
        if (message) {
            await this.gpPresetService.deleteGPPByPMID(pmId);
            return this.presetMessagesRepository.delete([pmId]);
        } else {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async deleteAdminPMS(isSuperAdmin: boolean, schoolId: number, pmIds: number[]) {
        if (isSuperAdmin) {
            // deleting all pms
            await this.presetMessagesRepository
                .createQueryBuilder('pm')
                .delete()
                .where('id IN (:...pmIds)', { pmIds })
                .execute();
        } else {
            const systemPMS = await this.presetMessagesRepository
                .createQueryBuilder('pm')
                .select('id AS presetMessageId, :schoolId AS schoolId')
                .setParameter('schoolId', schoolId)
                .where('id IN (:...pmIds)', { pmIds })
                .andWhere('school_id IS NULL')
                .andWhere('creator_id IS NULL')
                .getRawMany();

            // removing system pms from current school
            await this.removedPMSService.addRemovedPMS(systemPMS);

            // deleting school pms
            await this.presetMessagesRepository
                .createQueryBuilder('pm')
                .delete()
                .where('id IN (:...pmIds)', { pmIds })
                .andWhere('school_id=:schoolId', { schoolId })
                .execute();
        }
    }

    async deleteAllAdminPMS(
        isSuperAdmin: boolean,
        schoolId: number,
        lang: Language,
        excludedPmIds: number[],
        params: ActionParams<PMAdminTableRow>,
    ) {
        let deleteSchoolPMS = true;
        let deleteSystemPMS = true;

        // checking which pms needs to be deleted(school/system or both)
        for (const element of params.filters) {
            if (element.columnKey === 'schoolId') {
                if (!element.optionKey.includes('default')) {
                    deleteSystemPMS = false;
                }
                if (!element.optionKey.includes('school')) {
                    deleteSchoolPMS = false;
                }
                break;
            }
        }

        // the query to delete all schools pms whether i am school manager or super admin
        let deleteSchoolQuery = this.presetMessagesRepository
            .createQueryBuilder('pm')
            .delete()
            .where('school_id=:schoolId', { schoolId })
            .andWhere('creator_id IS NULL')
            .andWhere('lang=:lang', { lang });

        let systemAdminQuery;

        if (isSuperAdmin) {
            // the query to delete all system pms if im super admin
            systemAdminQuery = this.presetMessagesRepository
                .createQueryBuilder('pm')
                .delete()
                .setParameter('schoolId', schoolId)
                .andWhere('school_id IS NULL')
                .andWhere('creator_id IS NULL')
                .andWhere('lang=:lang', { lang });
        } else {
            // the query to delete all system pms from current school if im school manager
            systemAdminQuery = this.presetMessagesRepository
                .createQueryBuilder('pm')
                .select('id AS presetMessageId, :schoolId AS schoolId')
                .setParameter('schoolId', schoolId)
                .andWhere('school_id IS NULL')
                .andWhere('creator_id IS NULL')
                .andWhere('lang=:lang', { lang });
        }

        if (excludedPmIds.length > 0) {
            deleteSchoolQuery = deleteSchoolQuery.andWhere('id NOT IN (:...excludedPmIds)', { excludedPmIds });
            systemAdminQuery = systemAdminQuery.andWhere('id NOT IN (:...excludedPmIds)', { excludedPmIds });
        }
        if (params.userSearch) {
            deleteSchoolQuery = deleteSchoolQuery.andWhere('text LIKE :textFilter', {
                textFilter: `%${params.userSearch}%`,
            });
            systemAdminQuery = systemAdminQuery.andWhere('text LIKE :textFilter', {
                textFilter: `%${params.userSearch}%`,
            });
        }
        params.filters.forEach((element) => {
            switch (element.columnKey) {
                case 'gender':
                    deleteSchoolQuery = deleteSchoolQuery.andWhere('gender IN (:...genders)', {
                        genders: element.optionKey,
                    });
                    systemAdminQuery = systemAdminQuery.andWhere('gender IN (:...genders)', {
                        genders: element.optionKey,
                    });
                    break;
                case 'presetCategory':
                    deleteSchoolQuery = deleteSchoolQuery.andWhere('preset_category IN (:...presetCategories)', {
                        presetCategories: element.optionKey,
                    });
                    systemAdminQuery = systemAdminQuery.andWhere('preset_category IN (:...presetCategories)', {
                        presetCategories: element.optionKey,
                    });
                    break;
            }
        });

        // deleting all the relevant school pm
        if (deleteSchoolPMS) {
            deleteSchoolQuery.execute();
        }

        // if there are system pms that needs to be deleted we septate it to two cases:
        // 1. if i am super admin it deletes all relevant system pms
        // 2. if i am school manager it only removes the messages from your school(adds them to the removed messages table)
        if (deleteSystemPMS) {
            //1
            if (isSuperAdmin) {
                systemAdminQuery.execute();
            }
            //2
            else {
                const systemPMS = await systemAdminQuery.getRawMany();
                await this.removedPMSService.addRemovedPMS(systemPMS);
            }
        }
    }

    async editSchoolPm(pmInfo: Partial<PresetMessages>, schoolId: number) {
        //updates pm
        return this.presetMessagesRepository.save({ ...pmInfo, schoolId: schoolId });
    }

    async editAdminPm(pmInfo: Partial<PresetMessages>, schoolId: number) {
        //update pm
        const message = await this.presetMessagesRepository.findOne({
            where: { id: pmInfo.id, schoolId },
        });
        if (message) return this.presetMessagesRepository.save({ ...pmInfo });
    }

    /**
     * Asynchronously uploads preset messages from an Excel sheet into the database.
     *
     * @param sheet The Excel sheet containing the preset messages.
     * @param schoolId The ID of the school to associate the preset messages with.
     * @returns An object with properties `updated`, `newRecords`, and `buffer`.
     * @throws BadRequestException if there is an error while handling the preset messages.
     */
    async uploadPMEXCEL(sheet: ExcelSheet<PM_HEADERS>, schoolId: number): Promise<{ newRecords: number | string }> {
        const presetMessagesSearch: FindOptionsWhere<PresetMessages>[] = [];
        let presetMessagesToInsert: Partial<PresetMessages>[] = [];
        try {
            sheet.forEach((row) => {
                const lang = detectLang(row.text);
                // Here we assume the language of the other parameters is the same as the text.
                const gender = translateGender(row.gender);
                const category = translatePresetCategory(row.category);

                presetMessagesSearch.push({
                    schoolId,
                    text: row.text,
                    gender,
                });

                presetMessagesToInsert.push({
                    schoolId,
                    text: row.text,
                    gender,
                    presetCategory: category,
                    lang,
                });
            });

            const foundPresetMessages = await this.presetMessagesRepository.find({ where: presetMessagesSearch });

            // delete existing PresetMessages;
            if (foundPresetMessages.length) {
                presetMessagesToInsert = presetMessagesToInsert.filter((pm) => {
                    return !foundPresetMessages.some((existingPresetMessages) => {
                        return (
                            pm?.schoolId === existingPresetMessages.schoolId &&
                            pm?.text === existingPresetMessages.text &&
                            pm?.gender === existingPresetMessages.gender
                        );
                    });
                });
            }

            const savedPresetMessages = await this.presetMessagesRepository.save(presetMessagesToInsert);
            return { newRecords: savedPresetMessages.length };
        } catch (error) {
            this.logger.error('Error handling adding pms in excel: ' + error);
            throw new BadRequestException(error);
        }
    }

    async deleteAllSchoolPm(schoolId: number) {
        //delete all pms with that school id
        try {
            await this.presetMessagesRepository.delete({ schoolId });
        } catch (e) {
            console.error(e);
        }
    }
}
