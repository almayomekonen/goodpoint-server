import { TwoFactorService } from '@hilma/auth-nest';
import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { GOOD_POINTS_FETCH_LIMIT, SMS_SENDER_NAME } from 'src/common/consts';
import { SaveGpTeachersDto } from 'src/common/dtos/save-gp-taechers-dto.dto';
import { Language } from 'src/common/enums';
import { Emojis } from 'src/common/enums/emojis-enum.enum';
import { getTranslations } from 'src/common/translations/getTranslations';
import { TeachersGoodPointsReaction } from 'src/entities/teachers-good-points-reaction.entity';
import { TeachersGoodPoints } from 'src/entities/teachers-good-points.entity';
import { StaffService } from 'src/staff/staff.service';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TeachersGoodPointsService {
    private logger: Logger;
    constructor(
        @InjectRepository(TeachersGoodPoints)
        private teachersGoodPointsRepository: Repository<TeachersGoodPoints>,
        @InjectRepository(TeachersGoodPointsReaction)
        private readonly teachersGoodPointsReactionRepository: Repository<TeachersGoodPointsReaction>,
        @Inject(forwardRef(() => StaffService)) private readonly staffService: StaffService,
        private readonly twoFactorService: TwoFactorService,
    ) {
        this.logger = new Logger(TeachersGoodPointsService.name);
    }

    async goodPointsByTeacherId(teacherId: string, currUserId: string, page: number) {
        //when we fetch this gps we need to update isRead to 1, only to those that were sent to the current user
        await this.teachersGoodPointsRepository
            .update(
                {
                    senderId: teacherId,
                    receiverId: currUserId,
                },
                {
                    isRead: 1,
                },
            )
            .catch((err) => {
                this.logger.error('failed to update isRead to 1', err);
            });

        const data = await this.teachersGoodPointsRepository
            .createQueryBuilder('teacher_good_point')
            .select([
                'teacher_good_point.id AS id',
                'teacher_good_point.created AS date',
                'teacher_good_point.gpText AS gpText',
                'teacher_good_point.is_read AS viewCount',
                'IF(teacher_good_point.senderId = :currUserId,1,0) AS "isMe"',
            ])
            .setParameter('currUserId', currUserId)
            .where('teacher_good_point.receiverId=:teacherId AND teacher_good_point.senderId=:currUserId', {
                teacherId,
                currUserId,
            })
            .orWhere('teacher_good_point.receiverId=:currUserId AND teacher_good_point.senderId=:teacherId', {
                teacherId,
                currUserId,
            })
            .limit(GOOD_POINTS_FETCH_LIMIT)
            .offset(page * GOOD_POINTS_FETCH_LIMIT)
            .orderBy('teacher_good_point.created', 'DESC')
            .getRawMany();

        return data;
    }

    async countGoodPointNotView(currUserId: string, schoolId: number) {
        const data = await this.teachersGoodPointsRepository.count({
            where: {
                schoolId,
                receiverId: currUserId,
                isRead: 0,
            },
        });
        return data;
    }

    async saveTeachersGoodPoint(senderId: string, schoolId: number, saveGpDTO: SaveGpTeachersDto) {
        const result = await this.teachersGoodPointsRepository.save({
            senderId,
            schoolId,
            ...saveGpDTO,
        });
        return result;
    }

    @Cron('0 10,14,18 * * *', { name: 'TeachersNotViewedGps' })
    async goodPointNotView() {
        this.logger.log('Start running goodPointNotView');
        function changeHours(date: Date, hours: number) {
            date.setHours(date.getHours() + hours);

            return date;
        }

        //At 10:00 you need to check the messages sent since the last run (at 18:00, 16 hours ago)
        let time;
        if (new Date().getHours() == 10) {
            time = -16;
        } else {
            time = -4;
        }

        const teachersGPs = await this.teachersGoodPointsRepository.find({
            relations: {
                receiver: true,
            },
            where: {
                isRead: 0,
                created: MoreThanOrEqual(changeHours(new Date(), time)),
                receiver: [
                    { notifyDate: LessThanOrEqual(changeHours(new Date(), -36)), systemNotifications: true },
                    { notifyDate: IsNull(), systemNotifications: true },
                ],
            },

            select: {
                receiver: {
                    phoneNumber: true,
                    notifyDate: true,
                    preferredLanguage: true,
                },
            },
        });

        let phoneNumbersHe = [];
        let phoneNumbersAr = [];
        let receiversId = [];

        if (!teachersGPs.length) return this.logger.log('No gps found on goodPointNotView.');

        teachersGPs.forEach((gp) => {
            if (gp.receiver?.phoneNumber) {
                receiversId.push(gp.receiverId);

                if (gp.receiver.preferredLanguage == Language.HEBREW) phoneNumbersHe.push(gp.receiver.phoneNumber);
                else phoneNumbersAr.push(gp.receiver.phoneNumber);
            }
        });

        phoneNumbersHe = [...new Set(phoneNumbersHe)];
        phoneNumbersAr = [...new Set(phoneNumbersAr)];
        receiversId = [...new Set(receiversId)];

        const translationsHe = getTranslations(Language.HEBREW).smsMessageTeachers;
        const translationsAr = getTranslations(Language.ARABIC).smsMessageTeachers;

        const gpLink = process.env.SERVER_DOMAIN;

        const smsTextHe = translationsHe.message.replace('{{link}}', gpLink);
        const smsTextAr = translationsAr.message.replace('{{link}}', gpLink);

        //SendBulkSMS can't accept an empty array, with no phone numbers.
        const sendSmsArray = [];
        if (phoneNumbersHe.length) {
            sendSmsArray.push({ phone: phoneNumbersHe, text: smsTextHe });
        }
        if (phoneNumbersAr.length) {
            sendSmsArray.push({ phone: phoneNumbersAr, text: smsTextAr });
        }

        try {
            if (process.env.NODE_ENV === 'production' && sendSmsArray.length && process.env.SEND_SMS !== 'false') {
                await this.twoFactorService.sendBulkSMS(sendSmsArray, SMS_SENDER_NAME);
            }
        } catch (error) {
            this.logger.error('failed to run in send sms to teachers', error);
        }

        await this.staffService.updateNotifyDate(receiversId);

        this.logger.log('Done running goodPointNotView');

        return teachersGPs;
    }

    async getReceivedGps(teacherId: string, schoolId: number, perPage: number, pageNumber: number) {
        //once we fetch all these , we need to update isRead to 1
        await this.teachersGoodPointsRepository
            .update(
                {
                    schoolId,
                    receiverId: teacherId,
                },
                {
                    isRead: 1,
                },
            )
            .catch((err) => {
                this.logger.error('failed to update isRead to 1', err);
            });

        //getting the gps
        const gps = await this.teachersGoodPointsRepository.find({
            relations: {
                sender: true,
                reaction: true,
            },
            where: {
                schoolId,
                receiverId: teacherId,
            },
            select: {
                sender: {
                    firstName: true,
                    lastName: true,
                    id: true,
                },
                gpText: true,
                created: true,
                id: true,
                reaction: {
                    emoji: true,
                    id: true,
                },
            },
            take: perPage,
            skip: perPage * (pageNumber - 1),
            order: {
                created: 'DESC',
            },
        });

        return gps;
    }

    async getTeacherActivity(teacherId: string, schoolId: number, pageNumber: number, perPage: number) {
        const gps = await this.teachersGoodPointsRepository.find({
            relations: {
                sender: true,
                receiver: true,
                reaction: true,
            },
            where: {
                schoolId,
                senderId: teacherId,
            },
            select: {
                sender: {
                    firstName: true,
                    lastName: true,
                },
                receiver: {
                    firstName: true,
                    lastName: true,
                },
                gpText: true,
                created: true,
                id: true,
                reaction: {
                    emoji: true,
                    id: true,
                },
            },
            take: perPage,
            skip: perPage * (pageNumber - 1),
            order: {
                created: 'DESC',
            },
        });
        return gps;
    }

    async getNotReadCount(teacherId: string, schoolId: number) {
        const count = await this.teachersGoodPointsRepository.count({
            where: {
                schoolId,
                receiverId: teacherId,
                isRead: 0,
            },
        });
        return count;
    }

    async addReaction(gpId: number, emoji: Emojis) {
        const gp = await this.teachersGoodPointsRepository.findOne({
            where: {
                id: gpId,
            },
            select: {
                reaction: {
                    id: true,
                    emoji: true,
                },
                id: true,
            },
            relations: {
                reaction: true,
            },
        });
        if (!gp) throw new NotFoundException('gp not found');

        //if the new reaction is the same as the old one, we delete the reaction
        if (gp.reaction?.emoji != emoji) {
            //create the reaction
            const reaction = await this.teachersGoodPointsReactionRepository.save({
                emoji,
                teachersGoodPointId: gpId,
                id: gp.reaction?.id,
            });

            //update the gp with the reaction
            await this.teachersGoodPointsRepository.update(
                {
                    id: gpId,
                },
                {
                    reaction,
                },
            );
            return reaction;
        } else {
            //delete the reaction
            await this.teachersGoodPointsReactionRepository.delete({
                id: gp.reaction?.id,
            });
            return null;
        }
    }

    async getGpCountBySchool(schoolId: number) {
        return this.teachersGoodPointsRepository.count({ where: { schoolId } });
    }
}
