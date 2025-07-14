import {
    AccessLogger,
    AccessLoggerService,
    RequestUserType,
    Role,
    UserConfig,
    UserPassword,
    UserPasswordService,
    UserService,
    VERIFICATION_TOKEN,
} from '@hilma/auth-nest';
import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnauthorizedException,
    forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Container, Link, Text } from '@react-email/components';
import { Response } from 'express';
import { AccessTokenService } from 'src/access-token/access-token.service';
import { ClassesService } from 'src/classes/classes.service';
import { StarredActions } from 'src/common/consts/starredActions';
import { AddAdminDto } from 'src/common/dtos/add-admin.dto';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { SaveTeacherDto } from 'src/common/dtos/save-teacher-dto.tdo';
import { TeacherDetailsDto } from 'src/common/dtos/teachers-details-dto.dto';
import { Language, SchoolGrades } from 'src/common/enums';
import { RoleIds } from 'src/common/enums/role-ids.enum';
import { Roles as RoleNames } from 'src/common/enums/roles.enum';
import {
    convertDateToLocalDate,
    createXlsxBuffer,
    detectLang,
    generateRandomPassword,
    splitName,
    translateGender,
    translateGrade,
} from 'src/common/functions';
import { ExcelPipeResult } from 'src/common/pipes/excel-validator.pipe';
import { getTranslations } from 'src/common/translations/getTranslations';
import { TeachersHeaders, translations } from 'src/common/translations/translationObjects';
import { IdmUser } from 'src/common/types/idm-user.type';
import { TeacherRow } from 'src/common/types/teacher-row.type';
import { MailService } from 'src/mail/mail.service';
import { SchoolService } from 'src/school/school.service';
import { StudentService } from 'src/student/student.service';
import { StudyGroupService } from 'src/study-group/study-group.service';
import { TeachersGoodPointsService } from 'src/teachers-good-points/teachers-good-points.service';
import { StarredUserClassesService } from 'src/user-classes/starred-user-classes.service';
import { UserSchoolService } from 'src/user-school/user-school.service';
import { Between, Brackets, DeepPartial, FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { Classes, GoodPoint, Staff, StudyGroup, UserSchool } from '../entities';
import { generate } from 'randomstring';

@Injectable()
export class StaffService extends UserService {
    constructor(
        @Inject('USER_MODULE_OPTIONS') protected config_options: UserConfig,
        @InjectRepository(Staff)
        protected readonly staffRepository: Repository<Staff>,
        protected readonly jwtService: JwtService,
        protected readonly configService: ConfigService,
        @Inject(forwardRef(() => ClassesService))
        protected readonly classesService: ClassesService,
        protected readonly accessLoggerService: AccessLoggerService,
        @Inject(UserSchoolService) protected readonly userSchoolService: UserSchoolService,
        private readonly logger = new Logger(StaffService.name),
        protected readonly studyGroupService: StudyGroupService,
        protected readonly teacherGpsService: TeachersGoodPointsService,
        protected readonly userPasswordService: UserPasswordService,
        // protected readonly mailer: MailService,
        @Inject(StarredUserClassesService) protected readonly starredUserClassesService: StarredUserClassesService,
        private readonly accessTokenService: AccessTokenService,

        private mailService: MailService,
        @Inject(forwardRef(() => SchoolService))
        private readonly schoolService: SchoolService,
        private readonly studentService: StudentService,
    ) {
        super(
            config_options,
            staffRepository,
            jwtService,
            configService,
            mailService,
            accessLoggerService,
            userPasswordService,
        );
    }

    async registerUser(roleId: number, user: { username: string; password: string; schoolId: number }) {
        try {
            const newUser: Partial<Staff> = new Staff({ ...user });
            const userRole = new Role();
            userRole.id = roleId;
            newUser.roles = [userRole];
            const userData = await this.createUser<Staff>(newUser);
            this.userSchoolService.connectUserToSchool(roleId, user.schoolId, userData.id);
            return userData;
        } catch (err) {
            switch (err.code) {
                case 'ER_DUP_ENTRY':
                    throw new ConflictException('username is already taken'); //code 409
                default:
                    throw new InternalServerErrorException(); //code 500,not sure this is the best way
            }
        }
    }

    //this is a helper function
    async getUserRoles(userId: string) {
        const userRoles = await this.staffRepository
            .createQueryBuilder('user')
            // .select('roles.roles')
            .leftJoinAndSelect('user.roles', 'roles')
            .where('user.id=:user_id', { user_id: userId })
            .getOne();

        if (!userRoles || userRoles.roles.length === 0) {
            return false; //will return to a controller or other service
        }
        return userRoles.roles;
    }

    async getFullName(id: string): Promise<{ firstName: string; lastName: string }> {
        const user = await this.staffRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('user not found');
        return { firstName: user.firstName, lastName: user.lastName };
    }

    async isFirstLogin(userId: string, isAdmin: boolean) {
        const firstLoginKeyWord = isAdmin ? 'firstAdminLogin' : 'firstLogin';
        const user = await this.staffRepository.findOneBy({ id: userId }).catch((e) => {
            throw e;
        });
        const pref = JSON.parse(user.preferences);
        let firstLogin = pref[firstLoginKeyWord];
        const newPref = JSON.parse(JSON.stringify(pref));
        if (firstLogin !== false) {
            //undefined OR this is his first login
            firstLogin = true;
            newPref[firstLoginKeyWord] = false; //from now , this isn't my first login
            //updating user
            return this.staffRepository.save({ ...user, preferences: JSON.stringify(newPref) });
        }
        return firstLogin;
    }

    /**
     *
     * @param name the teacher's  lastName and firstName as object
     * @param schoolId  the teacher's school id
     * @returns  the teacher with
     */
    async findTeacherWithSchool(name: Partial<Staff>, schoolId: number) {
        const teacher = await this.staffRepository
            .createQueryBuilder('teacher')
            .select('teacher.id')
            .leftJoin('teacher.schools', 'user_school')
            .where('first_name=:firstName', { firstName: name.firstName })
            .andWhere('last_name=:lastName', { lastName: name.lastName })
            .andWhere('user_school.school_id=:schoolId', { schoolId })
            .getOne();
        return teacher;
    }

    async adminGetTeachers(adminId: string, schoolId: number) {
        //get users in the school who are either teachers or admins, meaning their role id is 1 or 2
        return this.staffRepository
            .createQueryBuilder('user')
            .select([
                'IF(user.id=:adminId,NULL,user.id) AS id',
                'first_name AS teacherFirstName',
                'last_name as teacherLastName',
                'gender AS teacherGender',
                'username as email',
                'grade',
                'class_index as classIndex',
            ])
            .leftJoin('user.roles', 'user_role')
            .leftJoin('user.classes', 'class')
            .leftJoin('user.schools', 'user_school')
            .where(
                new Brackets((qb) => {
                    qb.where(`user_role.id=${RoleIds.ADMIN}`).orWhere(`user_role.id=${RoleIds.TEACHER}`);
                }),
            )
            .andWhere('user_school.school_id=:schoolId', { schoolId })
            .orderBy('first_name')
            .addOrderBy('last_name')
            .setParameter('adminId', adminId)
            .getRawMany();
    }

    async getTeachersOfSchool(schoolId: number) {
        return await this.staffRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
            },
            where: {
                schools: { schoolId },
                roles: { id: In([RoleIds.ADMIN, RoleIds.TEACHER]) },
            },
            relations: ['schools'],
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });
    }

    async teacherGetTeachers(teacherId: string, schoolId: number) {
        const data = this.staffRepository.find({
            select: ['id', 'firstName', 'lastName', 'gender'],
            where: {
                schools: { schoolId },
                id: Not(teacherId),
                roles: { id: In([RoleIds.ADMIN, RoleIds.TEACHER]) },
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });

        return data;
    }

    async updateNotifyDate(teacherId: string[]) {
        return this.staffRepository.update({ id: In(teacherId) }, { notifyDate: new Date() });
    }

    async updateSystemNotifications(teacherId: string, systemNotifications: boolean) {
        return this.staffRepository.update({ id: teacherId }, { systemNotifications });
    }

    async updateTeacherDetails(teacherId: string, teacherDetailsDto: TeacherDetailsDto) {
        const teacher = await this.staffRepository.findOneBy({ username: teacherDetailsDto.username });
        if (teacher && teacher.id !== teacherId) throw new ConflictException('email already exists in the system');
        this.logger.log('updeted teacher details:', teacherDetailsDto);
        return this.staffRepository.update({ id: teacherId }, teacherDetailsDto);
    }

    async updateTeacherDetailsByAdmin(teacherId: string, saveTeacherDto: SaveTeacherDto, schoolId: number) {
        const teacherExist = await this.staffRepository.findOneBy({ id: teacherId });
        if (!teacherExist) throw new BadRequestException('user not found');

        const teacher = await this.staffRepository.findOneBy({ username: saveTeacherDto.username });
        if (teacher && teacher.id !== teacherId) throw new ConflictException('email already exists in the system');

        await this.staffRepository.update(
            { id: teacherId },
            {
                id: teacherId,
                firstName: saveTeacherDto.firstName,
                lastName: saveTeacherDto.lastName,
                username: saveTeacherDto.username,
                gender: saveTeacherDto.gender,
                phoneNumber: saveTeacherDto.phoneNumber,
            },
        );
        await this.classesService.updateTeacherClasses(schoolId, teacherId, saveTeacherDto.classes);
    }

    /**function for admin to delete a teacher
     * also deletes related user_schools, preset_messages and removed_preset_messages entities.
     * also makes teacherId column NULL in classes,good_point and archived_good_points entities
     *
     * @param teacherId the teacher to delete
     * @param adminsSchoolId the admin's school id
     */
    async deleteTeacher(teacherId: string, adminsSchoolId: number) {
        //user school has onDelete:cascade
        //classes has onDelete:SET NULL
        //good points has onDelete:SET NULL
        //archived good points has onDelete:SET NULL
        //preset messages has onDelete:cascade
        //removed preset messages has onDelete:cascade

        //if teacher was related to only one school -remove that teacher completely
        //else only remove the relation of the user_school

        //checking if the admin is in the teacher's school

        const teachersSchoolIds = (await this.userSchoolService.findUserSchoolIds(teacherId)).map(
            (val) => val.schoolId,
        );
        if (!teachersSchoolIds) throw new BadRequestException('no user school relation found');

        if (!teachersSchoolIds.includes(adminsSchoolId))
            throw new UnauthorizedException('admin is not in the same school as the teacher');

        if (teachersSchoolIds.length === 1) {
            // Delete instances of the teacher from the access_logger table
            this.staffRepository.manager
                .createQueryBuilder(AccessLogger, 'Access')
                .delete()
                .where('userId = :userId', { userId: teacherId })
                .execute();

            this.accessTokenService.removeAccessTokenByUserId(teacherId, adminsSchoolId);

            //then remove completely
            //deleting from user_password table
            await this.userRepository.manager
                .createQueryBuilder()
                .delete()
                .from(UserPassword)
                .where('userId=:userId', { userId: teacherId })
                .execute();

            return await this.userRepository.delete([teacherId]);
        } else {
            //then just remove the user_school relation (with the admins' schoolId)
            return await this.userSchoolService.removeUserSchoolRelation(teacherId, adminsSchoolId);
        }
    }

    /**
     * Soft deletes multiple teachers by removing them from classes, study groups,
     * and their association with the specified school.
     *
     * @param teacherIds - An array of teacher IDs to soft delete.
     * @param adminsSchoolId - The ID of the school where the admin belongs.
     * @returns A Promise that resolves when all teachers are soft deleted.
     * @throws BadRequestException if no teacher IDs are provided.
     */
    async softDeleteTeachers(teacherIds: string[], adminsSchoolId: number): Promise<void> {
        if (teacherIds.length === 0) {
            throw new BadRequestException('No teacher IDs provided');
        }

        const teacherIdsWithMatchingSchool = await this.userSchoolService.findTeacherIdsWithMatchingSchool(
            teacherIds,
            adminsSchoolId,
        );

        for (const teacherId of teacherIds) {
            try {
                this.validateAdminSchool(teacherId, teacherIdsWithMatchingSchool);
                await this.deleteTeacherSoft(teacherId, adminsSchoolId);
                this.logger.log(`Teacher with ID ${teacherId} deleted successfully.`);
            } catch (error) {
                this.logger.error(`Error deleting teacher with ID ${teacherId}: ${error.message}`);
            }
        }
    }

    /**
     * Deletes a teacher softly by removing them from classes, study groups,
     * and their association with the specified school.
     */
    async deleteTeacherSoft(teacherId: string, adminsSchoolId: number): Promise<void> {
        const teacher = await this.staffRepository.findOne({
            relations: { classes: true, studyGroups: true },
            where: { id: teacherId },
        });
        const teachersSchoolIds =
            (await this.userSchoolService.findUserSchoolIds(teacherId)).map((val) => val.schoolId) || [];
        const teachersClassIds =
            (await this.staffRepository.find({
                relations: {
                    classes: true,
                },
                where: {
                    id: teacherId,
                },
                select: {
                    classes: {
                        id: true,
                    },
                },
            })) || [];

        const classIds = teachersClassIds.flatMap((teacher) => teacher.classes.map((classObj) => classObj.id));

        if (this.canDeleteTeacher(teacher, teachersSchoolIds)) {
            await this.deleteTeacher(teacherId, adminsSchoolId);
        } else {
            await this.performSoftDelete(teacherId, adminsSchoolId, teacher, classIds);
        }
    }

    /**
     * Validates if the admin is in the same school as the teacher.
     */
    validateAdminSchool(teacherId: string, teacherIdsWithMatchingSchool: string[]): void {
        if (!teacherIdsWithMatchingSchool.includes(teacherId)) {
            throw new UnauthorizedException('Admin is not in the same school as teacher ID: ' + teacherId);
        }
    }

    /**
     * Checks if a teacher can be deleted.
     */
    canDeleteTeacher(teacher: Staff, teachersSchoolIds: number[]): boolean {
        return (
            teacher.studentsGoodPoints?.length === 0 &&
            teacher.receivedTeacherGoodPoints?.length === 0 &&
            teachersSchoolIds.length === 0
        );
    }

    /**
     * Performs the soft delete of a teacher.
     */
    async performSoftDelete(
        teacherId: string,
        adminsSchoolId: number,
        teacher: Staff,
        teachersClassIds: number[],
    ): Promise<void> {
        // Remove the desired classes and studyGroups from teacher.classes
        teacher.classes = teacher.classes.filter((cls) => cls.schoolId !== adminsSchoolId);
        teacher.studyGroups = teacher.studyGroups.filter((cls) => cls.schoolId !== adminsSchoolId);

        await this.starredUserClassesService.removeTeacherClassesRelations(teacherId, teachersClassIds);

        await Promise.all([
            this.userSchoolService.removeUserSchoolRelation(teacherId, adminsSchoolId),
            this.accessTokenService.removeAccessTokenByUserId(teacherId, adminsSchoolId),
            this.staffRepository.manager
                .createQueryBuilder(AccessLogger, 'Access')
                .delete()
                .where('userId = :userId', { userId: teacherId })
                .execute(),
            this.staffRepository.save(teacher),
        ]);
    }

    async deleteTeachersExceptById(body: AdminTableDto<TeacherRow>, schoolId: number) {
        try {
            const queryBuilder = this.staffRepository
                .createQueryBuilder('staff')
                .leftJoinAndSelect('staff.schools', 'schools')
                .leftJoinAndSelect('staff.classes', 'classObj')
                .where('schools.schoolId = :schoolId', { schoolId });

            const { selected, params } = body;
            const { filters, userSearch } = params;

            if (selected.length > 0) {
                queryBuilder.andWhere('staff.id NOT IN (:...selected)', { selected });
            }

            if (userSearch) {
                queryBuilder.andWhere("CONCAT(staff.firstName, ' ', staff.lastName) LIKE :userSearch", {
                    userSearch: `%${userSearch}%`,
                });
            }
            if (filters.length) {
                //Grade filters only
                filters.forEach((element) => {
                    queryBuilder.andWhere('classObj.grade IN (:...grade)', { grade: element.optionKey });
                });
            }

            const teachersToBeDeleted = await queryBuilder.getMany();
            console.log(`Found ${teachersToBeDeleted.length} teacher entities to be deleted`);
            return this.softDeleteTeachers(
                teachersToBeDeleted.map((teacher) => teacher.id),
                schoolId,
            );
        } catch (error) {
            console.error('🚀 ~ error', error);
            throw error;
        }
    }

    async deleteTeachersById(ids: string[], schoolId: number): Promise<void> {
        try {
            const teachers = await this.userRepository.find({
                where: {
                    id: In(ids),
                },
            });

            if (teachers.length === 0) {
                this.logger.log(`Could not find teachers with IDs: ${ids}`);
                throw new Error(`Could not find teachers`);
            }
            return this.softDeleteTeachers(ids, schoolId);
        } catch (error) {
            this.logger.error('🚀 ~ error', error);
            throw error;
        }
    }

    /**
     *
     * @param  userId the id of the target user
     * @param schoolId  the school id of the target user
     * @returns the context data that is used by the userContext in the client
     */
    async getContextData(userId: string, schoolId: number) {
        const getQueryForUserData = this.staffRepository
            .createQueryBuilder('user')
            .select('COUNT(gp.id)', 'goodPointsCount')
            .addSelect('user.username', 'username')
            .addSelect('user.firstName', 'firstName')
            .addSelect('user.lastName', 'lastName')
            .addSelect('user.phoneNumber', 'phoneNumber')
            .addSelect('user.preferredLanguage', 'preferredLanguage')
            .addSelect('user.system_notifications', 'systemNotifications')
            .addSelect('user.password', 'password')
            .leftJoin(GoodPoint, 'gp', 'gp.teacherId = user.id')
            .where('user.id = :userId', { userId });
        type userType = {
            username: string;
            firstName: string;
            password: string;
            lastName: string;
            goodPointsCount: string;
        };
        const [teacherClasses, userData, userSchoolIds, teacherStudyGroups, unreadGps] = await Promise.all([
            this.classesService.getTeacherStarredClasses(userId, schoolId),
            getQueryForUserData.getRawOne<userType>(),
            this.userSchoolService.findUserSchoolIds(userId, true),
            this.studyGroupService.getTeacherStudyGroups(userId, schoolId),
            this.teacherGpsService.countGoodPointNotView(userId, schoolId),
        ]);
        const { password, ...userInst } = userData;
        return {
            starred: { classes: teacherClasses, studyGroups: teacherStudyGroups },
            ...userInst,
            idmUser: password == null && userData.username.includes('idm'),
            schools: userSchoolIds.map((val) => {
                return { schoolId: val.schoolId, role: val.role, schoolName: val.school.name };
            }),
            currSchoolId: Number(schoolId),
            unreadGps,
        };
    }

    async addOrRemoveClassFromUser(classId: number, userId: string, schoolId: number, action: StarredActions) {
        const userRelated = await this.userSchoolService.checkIfUserRelatedToSchool(schoolId, userId);
        if (!userRelated) throw new UnauthorizedException('user not related to school');
        const classRelated = await this.classesService.classRelatedToSchool(schoolId, classId);
        if (!classRelated) throw new UnauthorizedException('class not related to school');

        await this.starredUserClassesService.addOrRemoveClassForUser(classId, userId, action);
        return true;
    }

    // needs fixing
    async addOrRemoveStudyGroupFromUser(studyGroup: number, userId: string, schoolId: number, action: StarredActions) {
        const userRelated = await this.userSchoolService.checkIfUserRelatedToSchool(schoolId, userId);
        if (!userRelated) throw new UnauthorizedException('user not related to school');
        const classRelated = await this.studyGroupService.groupRelatedToSchool(schoolId, studyGroup);
        if (!classRelated) throw new UnauthorizedException('study group not related to school');
        const queryBuilder = this.staffRepository
            .createQueryBuilder('staff')
            .relation(StudyGroup, 'starredBy')
            .of(studyGroup);
        if (action === 'add') await queryBuilder.add(userId);
        else await queryBuilder.remove(userId);
        return true;
    }

    async getAdminTeachers(schoolId: number) {
        const results = await this.staffRepository.find({
            where: {
                schools: {
                    schoolId,
                },
                type: 'staff',
            },
            relations: ['classes', 'schools'],
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                classes: true,
                schools: {
                    schoolId: true,
                },
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
                classes: {
                    grade: 'ASC',
                    classIndex: 'ASC',
                },
            },
        });

        const count = results.length;

        return { results, count };
    }

    async updatePreferredLanguage(userId: string, preferredLanguage: Language): Promise<void> {
        const result = await this.staffRepository.update({ id: userId }, { preferredLanguage });
        if (result.affected === 0) {
            this.logger.error(`User with id "${userId}" not found`);
            throw new Error(`User with id "${userId}" not found.`);
        }
    }

    async passwordReset(email: string, lang: Language) {
        const user = await this.staffRepository.findOneBy({ username: email });
        const translation = getTranslations(lang);
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.SERVER_DOMAIN;

        if (user) {
            const token = await (await this.generateVerificationTokenAndSave({ username: email }))[VERIFICATION_TOKEN];

            const text = (
                <Container>
                    <Text className="text-black text-[18px] leading-[24px]">
                        {translation.password_reset.headline_rest_password}
                    </Text>
                    <Text className="text-black text-[18px] leading-[24px]">
                        {translation.password_reset.click_on_link}
                        <Link
                            href={`${url}/changePassword/?token=${token}&email=${email}`}
                        >{` ${translation.password_reset.here}`}</Link>
                        {` ${translation.password_reset.reset_password}`}🔒
                    </Text>
                </Container>
            );

            this.mailService.send({
                from: translation.mails.gp,
                subject: `${translation.password_reset.mail_password_title}`,
                to: email,
                html: this.mailService.createHtmlMessage(text, translation.password_reset.password_reset, email, lang),
            });
        }
        return user;
    }

    /**
     * Uploads a list of teachers from an Excel sheet to the database.
     * @param sheet An array representing the Excel sheet.
     * @param schoolId The ID of the school associated with the students.
     * @returns A Promise that resolves to an array of the newly created teachers.
     */ async uploadTeachersEXCEL(sheet: ExcelPipeResult<TeachersHeaders>['sheet'], schoolId: number) {
        try {
            let gptTokens = 0;
            const classesSet = new Set<`${SchoolGrades}-${number}`>();
            const teachersToInsert: DeepPartial<Staff>[] = [];
            const teachersSearch: FindOptionsWhere<Staff>[] = [];

            const lang = detectLang(sheet[0].firstName);

            for (const row of sheet) {
                let { firstName, lastName } = row;
                const { phone, fullName, username, gender, classNumber: rawClassIndex, grade: rawGrade } = row;

                // handle splitting up full name into first name and last name
                if ((!firstName || !lastName) && fullName) {
                    const splitted = await splitName(fullName);
                    firstName ||= splitted.firstName;
                    lastName ||= splitted.lastName;
                    if (splitted.didUseGpt) {
                        gptTokens += splitted.tokensUsed;
                    }
                }
                // translate gender
                const translatedGender = translateGender(gender);
                // create the teacher object
                const teacherObject: DeepPartial<Staff> = {
                    firstName,
                    lastName,
                    gender: translatedGender,
                    username,
                    phoneNumber: phone,
                    roles: [{ id: RoleIds.TEACHER }],
                    schools: [{ schoolId, roleId: RoleIds.TEACHER }],
                };

                // Process grade and class index add the classes to a set of classes to avoid duplicity and handle errors
                const { grade, classIndex } = this.processGradeAndClass(rawClassIndex, rawGrade);
                classesSet.add(`${grade as SchoolGrades}-${classIndex}`);

                //  only if both are not null add them to the teacher object
                if (grade !== null && classIndex !== null) {
                    teacherObject.classes = [
                        {
                            classIndex,
                            grade: grade as SchoolGrades,
                        },
                    ];
                }

                teachersToInsert.push(this.staffRepository.create(teacherObject));

                teachersSearch.push({ username });
            }

            this.logger.log(`~~~ Inserting ${teachersToInsert.length} teachers to school ${schoolId}`);

            const foundOrCreatedClasses = await this.findOrCreateClasses(classesSet, schoolId);

            const foundTeachers = await this.staffRepository.find({ where: teachersSearch });

            const existingTeachersMap = new Map<
                string,
                { teacherId: string; classes: Classes[]; schools: UserSchool[] }
            >();
            foundTeachers.forEach((teacher) => {
                const teacherKey = teacher.username;
                existingTeachersMap.set(teacherKey, {
                    teacherId: teacher.id,
                    classes: teacher.classes ?? [],
                    schools: [...(teacher.schools ?? [])],
                });
            });

            const newTeachers = this.processTeachers(
                teachersToInsert,
                existingTeachersMap,
                schoolId,
                foundOrCreatedClasses,
                lang,
            );

            const updatedTeachersCount = foundTeachers.length;
            const newTeachersCount = teachersToInsert.length - updatedTeachersCount;

            // Generate Excel buffer for new teachers
            let buffer: ArrayBuffer;
            if (newTeachersCount) {
                buffer = await this.generateNewTeachersExcelBuffer(newTeachers, lang);
            }

            await this.staffRepository.save(teachersToInsert);
            //increment the school's gpt tokens
            await this.schoolService.incrementGptTokenCount(schoolId, gptTokens);

            this.logger.log(`Created ${newTeachersCount} teachers, updated ${updatedTeachersCount}`);

            return { updated: updatedTeachersCount, newRecords: newTeachersCount, buffer };
        } catch (err) {
            this.logger.error('Error handling adding teacher: ' + err);
            throw new BadRequestException(err);
        }
    }

    /**
     * Finds or creates classes based on the set of class identifiers.
     * @param {Set<`${SchoolGrades}-${number}`>} classIdentifiers - The set of class identifiers.
     * @param {number} schoolId - The ID of the school associated with the classes.
     * @returns {Promise<Record<`${SchoolGrades}-${number}`, Classes['id']> | undefined[]>} - The existing and new classes found or created in the database.
     */
    async findOrCreateClasses(
        classIdentifiers: Set<`${SchoolGrades}-${number}`>,
        schoolId: number,
    ): Promise<Record<`${SchoolGrades}-${number}`, Classes['id']> | undefined[]> {
        const classIdentifiersArray = Array.from(classIdentifiers);
        let foundOrCreatedClasses: Record<`${SchoolGrades}-${number}`, Classes['id']> | undefined[] = [];

        if (classIdentifiersArray.length > 0) {
            foundOrCreatedClasses = await this.classesService.findOrCreateByStrings(
                classIdentifiersArray,
                schoolId,
                'object',
            );
        }

        return foundOrCreatedClasses;
    }

    /**
     * Process the raw class index and grade values and extract the grade and class index.
     * @param {string | undefined} rawClassIndex - The raw class index value from the Excel sheet.
     * @param {string | undefined} rawGrade - The raw grade value from the Excel sheet.
     * @returns {{ grade: string | null, classIndex: number | null }} - The extracted grade and class index.
     * @throws {BadRequestException} If the grade or class index is invalid or missing.
     */
    processGradeAndClass(rawClassIndex: string | undefined, rawGrade: string | undefined) {
        let grade: string | null = null;
        let classIndex: number | null = null;

        if (rawClassIndex || rawGrade) {
            try {
                grade = rawGrade?.match(/[א-ת]+/g)?.join('');
                if (!grade) {
                    throw new BadRequestException('Invalid or missing grade');
                }
                grade = translateGrade(grade);

                classIndex = Number(rawGrade?.match(/\d+/)?.join('')) || Number(rawClassIndex);
                if (!classIndex) {
                    throw new BadRequestException('Invalid or missing class index');
                }
            } catch (err) {
                const errorMessage = err instanceof BadRequestException ? err.message : 'An error occurred';
                this.logger.error('Error handling teacher class and grade: ' + JSON.stringify(errorMessage));
                throw new BadRequestException(errorMessage);
            }
        }

        return { grade, classIndex };
    }

    /**
     * Process the teachers to insert, update existing teachers, and send emails to new teachers.
     * @param {DeepPartial<Staff>[]} teachersToInsert - The teachers to insert.
     * @param {Map<string, { teacherId: string, classes: Classes[], schools: UserSchool[] }>} existingTeachersMap - The map of existing teachers.
     * @param {number} schoolId - The ID of the school associated with the teachers.
     * @param {number} foundOrCreatedClasses - he existing and new classes found or created in the database.
     * @returns { newTeachers: DeepPartial<Staff>[]} - The new teachers and updated teachers.
     */
    processTeachers(
        teachersToInsert: DeepPartial<Staff>[],
        existingTeachersMap: Map<string, { teacherId: string; classes: Classes[]; schools: UserSchool[] }>,
        schoolId: number,
        foundOrCreatedClasses: Record<`${SchoolGrades}-${number}`, Classes['id']> | undefined[],
        lang: Language,
    ) {
        const newTeachers: DeepPartial<Staff>[] = [];
        teachersToInsert.forEach((teacher) => {
            const teacherKey = teacher.username;
            const existingTeacher = existingTeachersMap.get(teacherKey);

            if (existingTeacher) {
                const { teacherId, classes, schools } = existingTeacher;
                teacher.id = teacherId;

                // If teacher exists, add the school if it's not already associated
                if (!schools.some((school) => school.schoolId === schoolId)) {
                    teacher.schools = [...schools, { schoolId, roleId: RoleIds.TEACHER }];
                }
                // Adds the teacher's class to the array of classes only if it doesn't exist .
                if (
                    !classes.some(
                        (classItem) =>
                            classItem.grade === teacher.classes[0].grade &&
                            classItem.classIndex === teacher.classes[0].classIndex,
                    )
                ) {
                    teacher.classes = [
                        ...classes,
                        { grade: teacher.classes[0].grade, classIndex: teacher.classes[0].classIndex },
                    ];
                }
            } else {
                // Add new teacher, add the school and password
                const teacherWithPass = this.addNewTeacher(teacher, schoolId);

                // Sending email to new teachers with their password
                const translation = getTranslations(lang);
                const password = teacherWithPass.password;
                if (password) {
                    const text = `${translation.hello} ${teacher.firstName} ${teacher.lastName} ${translation.mails.yourPassword} ${password}`;
                    const textContent = translation.mails.changePass;
                    this.sendTeacherPassEmail(
                        teacher.username,
                        translation.mails.addedSuccessfully,
                        text,
                        [textContent],
                        lang,
                    );
                }
            }

            if (teacher.classes && teacher.classes.length > 0) {
                const classKey = `${teacher.classes[0].grade}-${teacher.classes[0].classIndex}`;
                teacher.classes[0].id = foundOrCreatedClasses[classKey];
            }
            newTeachers.push(teacher);
        });

        return newTeachers;
    }

    /**
     * Adds a password and school id to the teacher object.
     * @param {DeepPartial<Staff>} teacher - The teacher object to update.
     * @param {number} schoolId - The ID of the school associated with the teacher.
     * @returns {DeepPartial<Staff>} The updated teacher object.
     */
    addNewTeacher(teacher: DeepPartial<Staff>, schoolId: number): DeepPartial<Staff> {
        teacher.schools = [{ schoolId, roleId: RoleIds.TEACHER }];
        teacher.password = Math.random().toString(36).substring(2, 10);
        return teacher;
    }

    /**
     * Generates an Excel buffer for the newly created teachers.
     * @param {DeepPartial<Staff>[]} newTeachers - An array of newly created teacher objects.
     * @returns {Promise<ArrayBuffer|null>} A promise that resolves to an Excel buffer in the form of an ArrayBuffer, or null if no new teachers exist.
     */
    async generateNewTeachersExcelBuffer(
        newTeachers: DeepPartial<Staff>[],
        lang: Language,
    ): Promise<ArrayBuffer | null> {
        if (newTeachers.length > 0) {
            const formattedTeachers = this.formatExcelTeacherData(newTeachers, lang);
            return createXlsxBuffer(formattedTeachers, lang, [20, 50, 20]);
        }
        return null;
    }

    /**
        Sends a password reset email to a teacher.
        @param {string} email - The email address of the teacher.
        @param {string} subject - The subject of the email.
        @param {string} header - The header text of the email.
        @param {string[]} textContent - An array of text content for the email body.
        @param {Language} lang - The language of the email.
        @returns {Promise<void>} A promise that resolves when the email is sent successfully, or rejects with an error.
        @throws {Error} If an error occurs while sending the email.
    */
    async sendTeacherPassEmail(
        email: string,
        subject: string,
        header: string,
        textContent: string[],
        lang: Language,
    ): Promise<void> {
        const translation = getTranslations(lang);
        try {
            await this.mailService.send({
                from: translation.mails.gp,
                subject,
                to: email,
                html: this.mailService.createHtmlMessage(textContent, header, '', lang),
            });
        } catch (error) {
            this.logger.error('Error sending email to teachers: ' + JSON.stringify(error));
        }
    }

    async getTeacherById(teacherId: string, schoolId: number) {
        const teacher = await this.staffRepository.findOneOrFail({
            relations: {
                schools: true,
                classes: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                username: true,
                phoneNumber: true,
                classes: {
                    id: true,
                    grade: true,
                    classIndex: true,
                },
            },
            where: {
                id: teacherId,
                schools: {
                    schoolId,
                },
            },
        });
        this.logger.log(`got teacher ${teacher.firstName} ${teacher.lastName}.`);
        return teacher;
    }

    async newPassword(teacherId: string, lang: Language) {
        try {
            const teacher = await this.staffRepository.findOneBy({ id: teacherId });
            if (!teacher) throw new BadRequestException('user not found');
            const password = Math.random().toString(36).substring(2, 10);
            const updatedTeacher = await this.setPassword(teacherId, password);

            const translation = getTranslations(lang);
            const text = `${translation.mails.resetPassword}`;
            const textContent = `${translation.mails.yourNewPassword} ${password}`;

            this.sendTeacherPassEmail(
                teacher.username,
                translation.mails.resetPasswordTitle,
                text,
                [textContent],
                lang,
            );

            return { teacher: updatedTeacher, password };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new Error(error);
        }
    }

    /**
     * Saves a teacher with the provided data.
    @param {SaveTeacherDto} teacherDto - The data of the teacher to be saved.
    @param {number} schoolId - The ID of the school to which the teacher belongs.
    @param {Language} lang - The language used for translations.
    @returns {Promise<{ teacher: Teacher, password: string }>} An object containing the saved teacher and the generated password, if applicable.
    @throws {BadRequestException} If the user is not found.
    */
    async saveTeacher(teacherDto: SaveTeacherDto, schoolId: number, lang: Language) {
        const { password } = await this.saveUser(
            {
                firstName: teacherDto.firstName,
                lastName: teacherDto.lastName,
                username: teacherDto.username,
                gender: teacherDto.gender,
                phoneNumber: teacherDto.phoneNumber,
            },
            schoolId,
            RoleIds.TEACHER,
        );

        try {
            const newTeacher = await this.staffRepository.findOne({
                where: { username: teacherDto.username },
            });

            await this.classesService.updateTeacherClasses(schoolId, newTeacher.id, teacherDto.classes);

            if (password) {
                const translation = getTranslations(lang);
                const text = `${translation.hello} ${newTeacher.firstName} ${newTeacher.lastName}`;
                const textContent = [`${translation.mails.yourPassword} ${password}`];
                this.sendTeacherPassEmail(
                    newTeacher.username,
                    translation.mails.addedSuccessfully,
                    text,
                    textContent,
                    lang,
                );
            }

            return { teacher: newTeacher, password };
        } catch (error) {
            this.logger.error(`Error saving teacher: ${error.message}`);
            throw new Error(error);
        }
    }

    /**
     * Saves a admin with the provided data.
    @param {AddAdminDto} body - The data of the admin to be saved.
    @param {Language} lang - The language used for translations.
    @returns {Promise<{ user: staff, password: string }>} An object containing the saved teacher and the generated password, if applicable.
    @throws {BadRequestException} If the user is not found.
    */
    async saveAdmin(body: AddAdminDto, lang: Language): Promise<{ password: string; user: Staff }> {
        const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.SERVER_DOMAIN;

        const { user, password } = await this.saveUser(
            {
                username: body.username,
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
            },
            body.schoolId,
            RoleIds.ADMIN,
        );

        try {
            if (password) {
                const translation = getTranslations(lang);
                const text = `${translation.hello} ${user.firstName} ${user.lastName}`;
                const textContent = [
                    `${translation.mails.yourPassword} ${password}`,
                    `${translation.mails.adminNotice} ${url}`,
                ];
                this.sendTeacherPassEmail(user.username, translation.mails.addedSuccessfully, text, textContent, lang);
            }

            return { user: user, password };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(`Error saving admin: ${error.message}`);
            throw new Error(error);
        }
    }

    /**
     * Saves a user with the provided data, and associates them with a school and role.
    @param {Partial<Staff>} teacherDto - The data of the user to be saved.
    @param {number} schoolId - The ID of the school to which the user belongs.
    @param {RoleIds} roleId - The ID of the role of the user.
    @returns {Promise<{ password: string, user: Staff }>} An object containing the generated password (if applicable) and the saved user.
    @throws {ConflictException} If the user already exists at the school.
    @throws {Error} If there is an error saving the user.
    */
    async saveUser(
        teacherDto: Partial<Staff>,
        schoolId: number,
        roleId: RoleIds,
    ): Promise<{ password: string; user: Staff }> {
        try {
            const user = await this.staffRepository.findOne({
                select: {
                    id: true,
                    username: true,
                    phoneNumber: true,
                    schools: {
                        schoolId: true,
                        roleId: true,
                        userId: true,
                    },
                },
                relations: { schools: true },
                where: { username: teacherDto.username },
            });

            if (user) {
                //check if the user was already an admin at that school
                //admin role is 2
                const isAdminAlready = user.schools?.find(
                    (school) => school.schoolId === schoolId && school.roleId == RoleIds.ADMIN,
                );
                if (isAdminAlready) {
                    //throw 409 error
                    throw new ConflictException('user already admin at this school');
                }

                /**
                 * if the new user is a teacher , check if the user is already a teacher at the school
                 */
                if (
                    roleId == RoleIds.TEACHER &&
                    user.schools.some((school) => school.schoolId == schoolId && school.roleId == RoleIds.TEACHER)
                ) {
                    throw new ConflictException('The user already exists at the school');
                }

                await this.staffRepository.save({
                    id: user.id,
                    schools: [...(user.schools || []), { schoolId, roleId }],
                    phoneNumber: !user.phoneNumber ? teacherDto.phoneNumber : user.phoneNumber,
                });

                return { password: null, user };
            } else {
                const password = generateRandomPassword();

                const newUser = await this.staffRepository.save(
                    this.staffRepository.create({
                        schools: [{ schoolId, roleId }],
                        roles: [{ id: roleId }],
                        firstName: teacherDto.firstName,
                        lastName: teacherDto.lastName,
                        username: teacherDto.username,
                        gender: teacherDto.gender,
                        phoneNumber: teacherDto.phoneNumber ?? null,
                        password,
                    }),
                );
                //connecting user to school since the inserting the schools directly above does not work
                await this.userSchoolService.connectUserToSchool(roleId, schoolId, newUser.id);

                return { user: newUser, password };
            }
        } catch (error) {
            if (error instanceof ConflictException) throw error;
            this.logger.error(`Error saving admin: ${error.message}`);
            throw new Error(error);
        }
    }

    /**
     *
     * @method create translated object for xlsx table
     * @param {Staff[]} data - query result
     * @param {Language} lang - user lang for translation
     * Intended for exporting a teacher's good points report
     */
    formatReportData(data: Staff, lang: Language) {
        const formattedData: object[] = [];
        const labels = translations[lang].ExportReportTableTranslation;
        const grades = translations[lang].grades;

        data?.studentsGoodPoints?.forEach((val) => {
            formattedData.push({
                [labels.sender]: `${data.firstName} ${data.lastName}`,
                [labels.name]: `${val.student.firstName} ${val.student.lastName}`,
                [labels.class]: `${grades[val.student.class.grade]} ${val.student.class.classIndex}`,
                [labels.created]: val.created,
                [labels.text]: val.gpText,
            });
        });
        return formattedData;
    }
    /**
     *
     * @method create translated object for xlsx table
     * @param {Staff[]} data - query result
     * @param {Language} lang - user lang for translation
     * Intended for exporting a table with the passwords of the teachers added to the system
     */
    formatExcelTeacherData(data: DeepPartial<Staff>[], lang: Language) {
        const formattedData: object[] = [];
        const translation = getTranslations(lang);

        data.forEach((val) => {
            formattedData.push({
                [translation.teachersHeaders.fullName]: `${val.firstName} ${val.lastName}`,
                [translation.teachersHeaders.username[0]]: `${val.username}`,
                [translation.ExcelTeachersTranslation.password]: `${val.password}`,
            });
        });
        return formattedData;
    }

    /**
     * 
    The function in staff service and not in goodPoint service
    because the need to bring the teacher and all his good points,
    and not to bring every good point with the teacher who sent it
     *
     */
    async getGPsByTeacher(schoolId: number, teacherId: string, dates?: { from: string; to: string }) {
        const where: FindOptionsWhere<Staff> = {
            schools: [{ schoolId }],
            id: teacherId,
        };

        if (dates) {
            where.studentsGoodPoints = {
                created: Between(
                    convertDateToLocalDate(dates.from),
                    convertDateToLocalDate(new Date(dates.to).setHours(23, 59)),
                ),
            };
        }

        const teacherGPData = await this.staffRepository.findOne({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                studentsGoodPoints: {
                    student: { firstName: true, lastName: true, class: { grade: true, classIndex: true } },
                    id: true,
                    gpText: true,
                    created: true,
                    studentId: true,
                },
            },
            relations: [
                'studentsGoodPoints',
                'studentsGoodPoints.student',
                'studentsGoodPoints.student.class',
                'receivedTeacherGoodPoints',
            ],
            where: where,
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });

        return teacherGPData;
    }

    /**
     * The function creates a report of the good points that a specific teacher sent in a specific period.
     */

    async createTeacherReportXlsx(
        schoolId: number,
        teacherId: string,
        dates: { from: string; to: string },
        lang: Language,
    ) {
        const teacherGPData = await this.getGPsByTeacher(schoolId, teacherId, dates);
        const formattedData = this.formatReportData(teacherGPData, lang);

        return createXlsxBuffer(formattedData, lang, [20, 20, 20, 20, 80]);
    }

    /** Creates an xlsx buffer for the admin's teachers report
     *
     * @param schoolId
     * @param date
     * @param lang
     * @returns
     */
    async createAdminTeachersReport(schoolId: number, date: { from: string; to: string }, lang: Language) {
        const data = await this.staffRepository
            .createQueryBuilder('teacher')
            .select(['CONCAT(first_name,last_name) AS fullName', 'COUNT(teacher_id) AS gpCount'])
            .leftJoin('teacher.studentsGoodPoints', 'gps')
            .leftJoin('teacher.schools', 'school')
            .where('school.schoolId=:schoolId', { schoolId })
            .andWhere('gps.created BETWEEN :from AND :to', {
                from: convertDateToLocalDate(date.from),
                to: convertDateToLocalDate(new Date(date.to).setHours(23, 59)),
            })
            .addGroupBy('teacher_id')
            .addGroupBy('first_name')
            .addGroupBy('last_name')
            .orderBy('gpCount', 'DESC')
            .getRawMany();

        const labels = translations[lang].adminTeachersReport;
        const formattedData: object[] = [];

        data.forEach((teacher) => {
            formattedData.push({
                [labels.fullName]: teacher.fullName,
                [labels.gpCount]: teacher.gpCount,
            });
        });

        return createXlsxBuffer(formattedData, lang, [20, 20]);
    }

    /**
     * @returns school's teachers that are assigned to classes and their classes.
     *
     * *Used for monthly email for home teachers*
     */

    private async getSchoolHomeTeachers(schoolId: number) {
        return this.staffRepository.find({
            where: {
                schools: { schoolId },
                classes: { schoolId },
            },
            select: {
                id: true,
                preferredLanguage: true,
                username: true,
                classes: {
                    id: true,
                    teacherId: true,
                    grade: true,
                    classIndex: true,
                },
            },
            relations: ['classes', 'schools'],
        });
    }

    /**
     * Send on the 25th of every month an email to all home teachers that have students in their class that didn't receive any good-point this month.
     */
    @Cron('0 0 03 25 * *', { name: 'MonthlyGPS' })
    async sendHomeTeacherMonthlyEmail() {
        if (process.env.SEND_MONTHLY_EMAIL !== 'true') {
            this.logger.log('Send monthly email is disabled');
            return;
        }

        try {
            this.logger.log('Start sending monthly email');
            const schools = await this.schoolService.getSchools();
            let timeout = 0;
            for (const school of schools) {
                const schoolTeachers = await this.getSchoolHomeTeachers(school.id);

                for (const teacher of schoolTeachers) {
                    const students = await this.studentService.getStudentsWithoutMonthlyGpsByClassIds(
                        teacher.classes.map((cls) => cls.id),
                    );

                    if (!students.length) continue;

                    let currClassId = students[0].classId;
                    let currClass = teacher.classes.find((cls) => cls.id === currClassId);
                    const { mails, grades } = getTranslations(teacher.preferredLanguage);

                    const textArray = [];

                    for (const student of students) {
                        if (currClassId !== student.classId) {
                            currClassId = student.classId;
                            currClass = teacher.classes.find((cls) => cls.id === currClassId);
                            textArray.push(
                                <Text className="text-black text-[18px] leading-[24px] font-bold">{`${grades[currClass.grade]}-${currClass.classIndex}`}</Text>,
                            );
                        }

                        textArray.push(
                            <li>
                                {' '}
                                <Text className="text-black text-[18px] leading-[15px]">{`${student.firstName || ''} ${student.lastName || ''}`}</Text>
                            </li>,
                        );
                    }
                    const text = (
                        <Container>
                            <Text className="text-black text-[18px] leading-[30px]">{mails.for_your_info}</Text>
                            <Text className="text-black text-[18px] leading-[24px] font-bold">{`${grades[currClass.grade]}-${currClass.classIndex}`}</Text>
                            {textArray.map((element) => (element ? element : ''))}
                        </Container>
                    );

                    this.logger.log(`Sending monthly report to ${teacher.username} for ${students.length} students`);

                    //We send with intervals so gmail doesn't block us or mark us as spam.
                    setTimeout(
                        () => {
                            this.mailService.send(
                                {
                                    from: mails.gp,
                                    to: teacher.username,
                                    subject: mails.title_month,
                                    html: this.mailService.createHtmlMessage(
                                        text,
                                        mails.title_month,
                                        teacher.username,
                                        teacher.preferredLanguage,
                                    ),
                                },
                                null,
                                true,
                            );
                        },
                        (timeout += 1000),
                    );
                }
            }

            this.logger.log('Done Sending monthly email');
        } catch (err) {
            this.logger.error('Error in sendHomeTeacherMonthlyEmail', err);
        }
    }

    async loginByIdm(idmUser: IdmUser, res: Response) {
        const userInst = await this.staffRepository.findOne({
            where: {
                zehut: idmUser.zehut,
            },
            relations: {
                roles: true,
                schools: {
                    school: true,
                },
            },
            select: {
                username: true,
                id: true,
                roles: true,
                schools: true,
            },
        });

        console.log('user exists and he is ', userInst);
        if (userInst) {
            const body = this.login(
                {
                    id: userInst.id,
                    username: userInst.username,
                    roles: [RoleNames.TEACHER],
                    roleKeys: [],
                    type: 'staff',
                    schoolId: userInst?.schools[0].schoolId,
                } as RequestUserType,
                res,
            );
            await this.accessTokenService.saveAccessToken(
                body[process.env.ACCESS_TOKEN_NAME],
                body.id,
                userInst.schools[0].schoolId,
            );
            res.redirect(process.env.CLIENT_DOMAIN);
        } else {
            //find the schools by the school codes
            const schoolIds = await this.schoolService.findSchoolsByCodes(idmUser.schoolCodes);
            if (!schoolIds.length) throw new UnauthorizedException('school does not exist in our system');

            const username = 'idm' + generate(10);
            // //create a new user with no password
            const userData = await this.staffRepository.save({
                username,
                password: undefined,
                roles: [{ id: RoleIds.TEACHER }],
                firstName: idmUser.firstName,
                lastName: idmUser.lastName,
                gender: idmUser.gender,
                zehut: idmUser.zehut,
            });
            schoolIds.forEach((id) => this.userSchoolService.connectUserToSchool(RoleIds.TEACHER, id, userData.id));

            const body = this.login(
                {
                    id: userData.id,
                    username: userData.username,
                    roleKeys: [],
                    type: 'staff',
                    roles: [RoleNames.TEACHER],
                    schoolId: schoolIds[0],
                } as RequestUserType,
                res,
            );

            await this.accessTokenService.saveAccessToken(body[process.env.ACCESS_TOKEN_NAME], body.id, schoolIds[0]);
            res.redirect(process.env.CLIENT_DOMAIN);
        }
    }
}
