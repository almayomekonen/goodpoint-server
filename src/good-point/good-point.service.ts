import { SpamManagerService, TwoFactorService } from '@hilma/auth-nest';
import { HttpException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { shuffle } from 'src/common/functions/shuffle.functions';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { GOOD_POINTS_FETCH_LIMIT } from 'src/common/consts';
import { SMS_SENDER_NAME } from 'src/common/consts/sms-sender-name';
import { Gender, Language, UpdateGpCount } from 'src/common/enums';
import { limitTextAtDelimiter } from 'src/common/functions';
import { getTranslations } from 'src/common/translations/getTranslations';
import { GoodPoint } from 'src/entities';
import { GoodPointsPresetService } from 'src/good-points-preset/good-points-preset.service';
import { GoodPointsReactionsService } from 'src/good-points-reactions/good-points-reactions.service';
import { StaffService } from 'src/staff/staff.service';
import { StudentService } from 'src/student/student.service';
import { EntityManager, In, Not, Repository } from 'typeorm';

@Injectable()
export class GoodPointService {
    private readonly logger = new Logger(GoodPointService.name);

    constructor(
        @InjectRepository(GoodPoint)
        private goodPointRepository: Repository<GoodPoint>,
        private readonly studentService: StudentService,
        @Inject(forwardRef(() => StaffService))
        private readonly staffService: StaffService,
        private readonly goodPointsPresetService: GoodPointsPresetService,
        private readonly twoFactorService: TwoFactorService,
        private readonly spamManagerService: SpamManagerService,
        private readonly gpReactionService: GoodPointsReactionsService,
    ) {}

    getColumnNames(): Record<keyof GoodPoint, string> {
        return this.goodPointRepository.metadata.columns.reduce(
            (value, col) => {
                value[col.propertyName] = col.databaseName;
                return value;
            },
            {} as Record<keyof GoodPoint, string>,
        );
    }

    /**
     *
     * @param manager Transaction manager. This function runs only with transaction and as a part of new-year process.
     */
    async deleteAllGoodPoints(manager: EntityManager) {
        return manager.getRepository(GoodPoint).delete({});
    }

    /**
     *
     * @param schoolId The id of the school in which the student is in
     * @param studentId  The id of the student
     * @returns  The gps that the student received in that school
     */
    async getStudentGps(schoolId: number, studentId: number) {
        const results = await this.goodPointRepository.find({
            relations: {
                teacher: true,
                student: {
                    class: true,
                },
            },
            where: {
                studentId,
                schoolId,
            },
            select: {
                id: true,
                gpText: true,
                created: true,

                teacher: {
                    firstName: true,
                    lastName: true,
                },

                student: {
                    firstName: true,
                    lastName: true,
                    classId: true,
                    class: {
                        grade: true,
                        classIndex: true,
                    },
                },
            },
            order: { created: 'DESC' },
        });
        return results;
    }

    /**
     * @param schoolId The id of the school in which the teacher is in
     * @param teacherId  The id of the teacher
     * @returns  The gps that the teacher gave in that school
     * */
    async getTeacherGps(schoolId: number, teacherId: string) {
        return await this.goodPointRepository.find({
            select: {
                id: true,
                gpText: true,
                created: true,
                teacher: {
                    firstName: true,
                    lastName: true,
                },
                student: {
                    firstName: true,
                    lastName: true,
                    classId: true,
                    class: {
                        grade: true,
                        classIndex: true,
                    },
                },
            },
            relations: {
                teacher: true,
                student: {
                    class: true,
                },
            },
            where: {
                schoolId: schoolId,
                teacherId: teacherId,
            },
            order: { created: 'DESC' },
        });
    }

    /**
     *
     * @param schoolId The id of the school in which the student is in
     * @param studentId  The id of the student
     * @param currUserId  The id of the user that is requesting the data
     * @param page  The page number- used to calculate the offset for the infinite query
     * @returns  The gps that the student received in that school
     */
    async goodPointsByStudentId(studentId: number, schoolId: number, currUserId: string, page: number) {
        const data = await this.goodPointRepository
            .createQueryBuilder('good_point')
            .select([
                'good_point.id AS id',
                'good_point.created AS date',
                'good_point.gpText AS gpText',
                'good_point.view_count AS viewCount',
                'teacher.firstName AS firstName',
                'teacher.lastName AS lastName',
                'IF(teacher.id = :currUserId,1,0) AS "isMe"',
            ])
            .setParameter('currUserId', currUserId)
            .leftJoin('good_point.teacher', 'teacher')
            .where('good_point.studentId=:studentId', { studentId })
            .andWhere('good_point.schoolId= :schoolId', { schoolId })
            .limit(GOOD_POINTS_FETCH_LIMIT)
            .offset(page * GOOD_POINTS_FETCH_LIMIT)
            .orderBy('good_point.created', 'DESC')
            .getRawMany();
        return data;
    }

    /**This function sends a 'group' gp to a group of students , meaning the same gp is sent to all of the selected students
     *
     * @param studentIds The ids of the students that are receiving the gp
     * @param teacherId  The id of the teacher that is sending the gp
     * @param schoolId  The id of the school in which the teacher is in
     * @param gpText  The content of the gp
     * @param lang   The language of the gp
     * @returns
     */
    async sendGroupGp(studentIds: number[], teacherId: string, schoolId: number, gpText: string, lang: Language) {
        const gps = await Promise.all(
            studentIds.map((studentId) => {
                return this.sendGoodPoint(teacherId, schoolId, studentId, gpText, lang);
            }),
        );
        return gps;
    }

    /**This function saves a good point in the database
     *
     * @param teacherId The id of the teacher that is sending the gp
     * @param schoolId  The id of the school in which the teacher is in
     * @param studentId  The id of the student
     * @param gpText  The content of the gp
     * @returns The newly created gp
     */
    async saveGoodPoint(teacherId: string, schoolId: number, studentId: number, gpText: string) {
        let saved = false;
        while (!saved) {
            try {
                //get 7 characters for linkhash
                const linkHash = randomBytes(7).toString('hex').slice(0, 7);
                const result = await this.goodPointRepository.save({
                    teacherId,
                    schoolId,
                    studentId,
                    gpText,
                    gpLinkHash: linkHash,
                });
                saved = true;
                return result;
            } catch (e) {
                if (e.code !== 'ER_DUP_ENTRY') {
                    console.error('Error in save gp:', e);
                    throw new Error(e);
                }
                console.log("can't save good point");

                //As long as there is an error(the linkHash not unieq), the loop runs.
            }
        }
    }

    /** This function saves a new gp and updates the student's gp count and also sends a push notification to the student
     * @param teacherId The id of the teacher that is sending the gp
     * @param schoolId  The id of the school in which the student is in
     * @param studentId  The id of the student
     * @param gpText    The text of the gp
     * @param lang  The language of the gp
     * @param openSentenceId  The id of the open sentence(preset message) that the gp is related to
     * @returns The newly created gp
     */
    async sendGoodPoint(
        teacherId: string,
        schoolId: number,
        studentId: number,
        gpText: string,
        lang: Language,
        openSentenceId?: number,
    ) {
        await this.studentService.studentInSchool(studentId, schoolId);

        const goodPoint = await this.saveGoodPoint(teacherId, schoolId, studentId, gpText);

        await this.studentService.updateGpCount(studentId, UpdateGpCount.increment);
        const studentInfo = await this.studentService.getStudentNameAndPhones(studentId);

        const phoneNumbersArr = studentInfo.relativesPhoneNumbers.map((item) => item.phone);
        if (studentInfo.phoneNumber) phoneNumbersArr.push(studentInfo.phoneNumber);

        const teacher = await this.staffService.getFullName(teacherId);

        const gpLink =
            !process.env.SERVER_DOMAIN || !process.env.SERVER_DOMAIN.length
                ? null
                : `${process.env.SERVER_DOMAIN}/s/${goodPoint.gpLinkHash}`;

        const translations = getTranslations(lang).smsMessage;

        let smsOpening = `${translations.hello}, ${studentInfo.firstName} ${
            studentInfo.gender === Gender.FEMALE ? translations.female : translations.male
        } ${translations.gp}`;

        if (teacher.firstName) {
            smsOpening += ` ${translations.from}${teacher.firstName}`;
        }
        if (teacher.lastName) {
            smsOpening += ` ${teacher.lastName}!\n`;
        }

        const limitedGPText = limitTextAtDelimiter(gpText, 20);

        const url =
            process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
                ? this.spamManagerService.removeHttp(process.env.DOMAIN_NAME)
                : process.env.SERVER_DOMAIN;

        let smsEnding = '';
        if (gpLink) {
            smsEnding = `\n${translations.watch_desgin}: ${gpLink}`;
        }
        const spam = `\n\n${translations.addToSpam} ${url}/api/spam?s=`;
        const smsText = smsOpening + limitedGPText + smsEnding;

        try {
            if (process.env.NODE_ENV === 'production' && phoneNumbersArr.length && process.env.SEND_SMS !== 'false') {
                await this.twoFactorService.sendBulkSMS(
                    [{ phone: phoneNumbersArr, text: smsText }],
                    SMS_SENDER_NAME,
                    true,
                    (phone) => `${spam}${shuffle(phone)}`,
                );
            }
        } catch (error) {
            this.logger.error('failed to run in send sms', error);
        }

        if (openSentenceId) {
            await this.goodPointsPresetService.saveGP_PM(goodPoint.id, openSentenceId, schoolId);
        }

        return goodPoint;
    }

    /**This function gets the gps that a teacher sent in a specific school
     *
     * @param teacherId The id of the teacher that sent the gps
     * @param schoolId  The id of the school to get the teacher's gps from
     * @param pageNumber Used for pagination , determines how many gps have been requested so far
     * @param perPage  Used for pagination, determines how many to get each request
     * @returns  The gps that the teacher sent in the school
     */
    async getTeacherSentGps(teacherId: string, schoolId: number, pageNumber: number, perPage: number) {
        const gps = await this.goodPointRepository.find({
            relations: {
                teacher: true,
                reactions: true,
                student: true,
            },
            where: {
                schoolId,
                teacherId: teacherId,
            },
            select: {
                id: true,
                gpText: true,
                created: true,
                teacher: {
                    firstName: true,
                    lastName: true,
                },
                reactions: {
                    sender: true,
                    created: true,
                    id: true,
                    reaction: true,
                },
                student: {
                    firstName: true,
                    lastName: true,
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

    /**
     * @param link The link of the gp
     * @returns The gp that has the given link
     */
    async getGpByLink(link: string) {
        //update the view count of the gp

        const gp = await this.goodPointRepository.findOne({
            select: {
                id: true,
                gpText: true,
                created: true,
                student: {
                    firstName: true,
                    lastName: true,
                },
                teacher: {
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                },
            },
            where: {
                gpLinkHash: link,
            },
            relations: {
                student: true,
                teacher: true,
            },
        });
        if (!gp) {
            throw new HttpException('gp not found', 404);
        }

        //incrementing the view count
        try {
            await this.goodPointRepository.increment({ gpLinkHash: link }, 'viewCount', 1);
        } catch (e) {
            this.logger.error('failed to increment view count', e);
        }

        //checking if the gp is from this school year , meaning between 1.9 to 31.8
        if (gp.created) {
            const now = new Date();
            let year = now.getFullYear();
            //checking if the month is before september
            if (now.getMonth() < 8) {
                year--;
            }
            //the start date is 1.9 and the end date is 31.8 the year after
            const start = new Date(year, 8, 1);
            const end = new Date(year + 1, 7, 31);
            //checking if the gp is not between the dates
            if (gp.created < start || gp.created > end) {
                //throwing a bad request exception
                throw new HttpException('gp is too old', 498);
            }
        }

        return gp;
    }

    /**
     *
     * @param ids The ids of the gps to delete
     * @param studentId The id of the student that received the gps
     * @returns The number of gps that were deleted
     * @throw Error if no gps to delete were found
     */
    async DeleteGoodPointsById(ids: string[], studentId: number): Promise<number> {
        try {
            const result = await this.goodPointRepository.delete({
                id: In(ids),
            });

            if (result.affected === 0) {
                this.logger.log(`Could not find good - points: ${ids} `);
                throw new Error(`no good points found while searching for delete `);
            }

            this.logger.log(`Deleted ${result.affected} good - points entities`);

            await this.studentService.updateGpCount(studentId, UpdateGpCount.decrement, result.affected);

            return result.affected;
        } catch (error) {
            this.logger.error('🚀 ~ error', error);
            throw error;
        }
    }

    /**
     * This function deletes all the gps by id that a student received except for the ones that are in the ids array
     * @param ids The id of the gps NOT to delete
     * @param studentId the id of the student that received the gps
     * @returns  The number of gps that were deleted
     */
    async deleteGoodPointsExceptById(ids: string[], studentId: number): Promise<number> {
        try {
            const result = await this.goodPointRepository.delete({
                id: Not(In(ids)),
                student: { id: studentId },
            });
            this.logger.log(`Deleted ${result.affected} GoodPoint entities`);
            await this.studentService.updateGpCount(studentId, UpdateGpCount.decrement, result.affected);

            return result.affected;
        } catch (error) {
            this.logger.error('🚀 ~ error', error);
            throw error;
        }
    }

    /**
     *
     * @param schoolId The id of the school to get the gps from
     * @returns True if the school has gps , false otherwise
     */
    async doesSchoolHaveGp(schoolId: number): Promise<boolean> {
        const result = await this.goodPointRepository.findOne({
            where: {
                schoolId,
            },
        });
        return !!result;
    }

    /**
     *
     * @param schoolId The id of the school to get the gps from
     * @returns The number of gps that the school has
     */
    async getGpCountBySchool(schoolId: number) {
        return this.goodPointRepository.count({ where: { schoolId } });
    }
}
