import { ConflictException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenService } from 'src/access-token/access-token.service';
import { ClassesService } from 'src/classes/classes.service';
import { determineSchoolType, groupNamesByAlphabet } from 'src/common/functions';
import { School } from 'src/entities';
import { GoodPointService } from 'src/good-point/good-point.service';
import { PresetMessagesService } from 'src/preset-messages/preset-messages.service';
import { StudentService } from 'src/student/student.service';
import { TeachersGoodPointsService } from 'src/teachers-good-points/teachers-good-points.service';
import { UserSchoolService } from 'src/user-school/user-school.service';
import { In, Repository } from 'typeorm';

@Injectable()
export class SchoolService {
    private readonly logger = new Logger(ClassesService.name);

    constructor(
        @InjectRepository(School) private schoolsRepository: Repository<School>,
        private studentsService: StudentService,
        @Inject(forwardRef(() => PresetMessagesService))
        private pmsService: PresetMessagesService,
        @Inject(forwardRef(() => ClassesService))
        private classesService: ClassesService,
        private userSchoolService: UserSchoolService,
        @Inject(forwardRef(() => GoodPointService))
        private gpService: GoodPointService,
        private teacherGpService: TeachersGoodPointsService,
        private readonly accessTokenService: AccessTokenService,
    ) {}

    async addSchool(school: Partial<School>) {
        //checking if school already exists
        const alreadyExistingSchool = await this.schoolsRepository.findOneBy({
            code: school.code,
        });
        if (alreadyExistingSchool) throw new ConflictException('there is already a school with that code');
        const newSchool = this.schoolsRepository.create({ ...school });
        return this.schoolsRepository.save(newSchool);
    }

    /**
     *
     * @returns all schools with number of students, raw.
     */
    async getSchoolsAndStudentsCount() {
        const schools = await this.schoolsRepository
            .createQueryBuilder('school')
            .select(['code ', 'school.name as name', 'school.id as id', 'COUNT(students.id) as numOfStudents'])
            .leftJoin('school.students', 'students')
            .groupBy('school.id')
            .getRawMany();
        return schools;
    }

    async updateSchool(school: Partial<School>) {
        //first check if the updated school code already exists
        const alreadyExistingSchool = await this.schoolsRepository.findOneBy({
            code: school.code,
        });
        if (alreadyExistingSchool) throw new ConflictException('there is already a school with that code');
        return this.schoolsRepository.save({ ...school });
    }

    async getStudentsOfSchool(
        schoolId: number,
        pageNumber: number,
        perPage: number,
        currentUserId: string,
        filterName: string,
    ) {
        const students = await this.studentsService.getStudentsOfSchool(schoolId, pageNumber, perPage, filterName);
        //sorting the array
        const sortedUsers = groupNamesByAlphabet(students);
        return sortedUsers;
    }

    async getAdminStudentPaginated(
        schoolId: number,
        pageNumber: number,
        perPage: number,
        filterName: string,
        grade?: string[],
    ) {
        try {
            const students = await this.studentsService.getAdminStudentPaginated(
                schoolId,
                pageNumber,
                perPage,
                filterName,
                grade,
            );
            return { ...students, prePage: 10 };
        } catch (error) {
            console.error(`Error occurred while fetching students for school with ID ${schoolId}: ${error}`);
            throw error;
        }
    }

    async incrementGptTokenCount(schoolId: number, tokens: number) {
        await this.schoolsRepository.increment({ id: schoolId }, 'gptTokenCount', tokens);
    }

    async deleteSchool(schoolId: number) {
        //only delete school if it has no gps
        const doesSchoolHaveGps = await this.gpService.doesSchoolHaveGp(schoolId);
        if (!doesSchoolHaveGps)
            try {
                // remove all preset message associated with that school
                await this.pmsService.deleteAllSchoolPm(schoolId);
                this.logger.log('deleted all preset messages associated with school with ID: ' + schoolId);

                // remove all students associated with that school
                await this.studentsService.deleteSchoolStudents(schoolId);
                this.logger.log('deleted all students associated with school with ID: ' + schoolId);

                // remove all classes related to that school
                await this.classesService.deleteSchoolClasses(schoolId);
                this.logger.log('deleted all classes associated with school with ID: ' + schoolId);

                // remove all classes related to that school
                await this.accessTokenService.removeAccessTokenBySchoolId(schoolId);
                this.logger.log('deleted all access tokens associated with school with ID: ' + schoolId);

                // finally remove the school
                await this.schoolsRepository.delete({ id: schoolId });
                this.logger.log('deleted school with ID: ' + schoolId);
                return schoolId;
            } catch (error) {
                this.logger.error(`Error occurred while deleting school with ID ${schoolId}: ${error}`);
                throw error;
            }
        else {
            //soft delete school
            try {
                await this.schoolsRepository.softDelete({ id: schoolId });
                this.logger.log('soft deleted school with ID: ' + schoolId);

                //also soft delete schools from user_school table
                await this.userSchoolService.softDeleteUserSchoolRelation(schoolId);
                this.logger.log('soft deleted user_school with school ID: ' + schoolId + ' from user_school table');

                return schoolId;
            } catch (error) {
                this.logger.error(`Error occurred while soft deleting school with ID ${schoolId}: ${error}`);
                throw error;
            }
        }
    }

    /**
     *
     * @param schoolId
     * @returns the number of teachers in the school,the grade range , the students and teachers gp count  and the school type - elementary, middle, high , etc...
     */
    async getSchoolExtraInfo(schoolId: number) {
        //number of teachers in school and range of grades in school
        const [numOfTeachers, gradeRange, studentsGpCount, teachersGpCount] = await Promise.all([
            this.userSchoolService.getNumberOfTeachersInSchool(schoolId),
            this.classesService.getSchoolGradeRange(schoolId),
            this.gpService.getGpCountBySchool(schoolId),
            this.teacherGpService.getGpCountBySchool(schoolId),
        ]);
        //determine school type
        const schoolType = gradeRange ? determineSchoolType(gradeRange.smallestGrade, gradeRange.largestGrade) : null;

        //admins of schools
        // const admins = await this.userSchoolService.getAdminsOfSchool(schoolId)
        return {
            numOfTeachers,
            schoolType,
            gradeRange,
            studentsGpCount,
            teachersGpCount,
            // admins
        };
    }

    async getSchools() {
        return this.schoolsRepository.find();
    }

    async findSchoolsByCodes(schoolCodes: string[]) {
        return (
            await this.schoolsRepository.find({
                select: {
                    id: true,
                },
                where: {
                    code: In(schoolCodes),
                },
            })
        ).map((sc) => sc.id);
    }
}
