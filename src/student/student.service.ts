import {
    BadRequestException,
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as JSZip from 'jszip';
import { ClassesService } from 'src/classes/classes.service';
import { STUDENTS_FETCH_LIMIT } from 'src/common/consts';
import { StudentByClassParams } from 'src/common/dtos';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { SaveStudentDto } from 'src/common/dtos/save-student-dto.dto';
import { Gender, Language, SchoolGrades, UpdateGpCount } from 'src/common/enums';
import {
    convertDateToLocalDate,
    createSearchString,
    createXlsxBuffer,
    extractGradeAndClass,
    groupNamesByAlphabet,
    handlePhoneNumber,
    splitName,
    translateGender,
} from 'src/common/functions';
import { ExcelSheet } from 'src/common/pipes/excel-validator.pipe';
import { getTranslations } from 'src/common/translations/getTranslations';
import { StudentHeaders, translations } from 'src/common/translations/translationObjects';
import { FilterSetting } from 'src/common/types/action-params.interface';
import { StudentRow } from 'src/common/types/student-row.type';
import { Classes, GoodPoint, Student } from 'src/entities';
import { MailService } from 'src/mail/mail.service';
import { PDFService } from 'src/pdf/pdf.service';
import { SchoolService } from 'src/school/school.service';
import { Between, Brackets, DeleteResult, EntityManager, FindOptionsWhere, In, Repository } from 'typeorm';

@Injectable()
export class StudentService {
    private readonly logger = new Logger(StudentService.name);

    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        private mailService: MailService,
        private readonly pdfService: PDFService,
        @Inject(forwardRef(() => ClassesService))
        private classesService: ClassesService,
        @Inject(forwardRef(() => SchoolService))
        private schoolService: SchoolService,
    ) {}

    async updateTwelveGradeStudents(manager: EntityManager) {
        const twelveGradeStudents = manager.createQueryBuilder(Classes, 'class').select(['class.id']).where('grade=12');

        await manager
            .createQueryBuilder(Student, 'students')
            .update()
            .set({ class: null })
            .where(`class_id IN (${twelveGradeStudents.getQuery()})`)
            .execute();
        return true;
    }

    async updateGpCount(studentId: number, update: UpdateGpCount, value?: number) {
        if (update == 'increment') {
            await this.studentsRepository.increment({ id: studentId }, 'gpCount', value ?? 1);
        }
        if (update == 'decrement') {
            await this.studentsRepository.decrement({ id: studentId }, 'gpCount', value ?? 1);
        }
        return true;
    }

    async getStudentById(studentId: number) {
        try {
            const student = await this.studentsRepository.findOne({
                relations: { class: true, relativesPhoneNumbers: true },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                    classId: true,
                    phoneNumber: true,
                    relativesPhoneNumbers: { phone: true },
                    phoneNumber2: true,
                    phoneNumber3: true,
                    phoneNumber4: true,
                    class: {
                        grade: true,
                        classIndex: true,
                    },
                },
                where: { id: studentId },
            });
            this.logger.log(`got student ${student.firstName} ${student.lastName}.`);
            return student;
        } catch (error) {
            this.logger.log(`failed to get student error:${error}.`);
        }
    }

    async getStudentNameAndPhones(studentId: number) {
        const data = await this.studentsRepository.findOne({
            select: {
                id: true,
                firstName: true,
                gender: true,
                phoneNumber: true,
                relativesPhoneNumbers: true,
            },
            relations: ['relativesPhoneNumbers'],
            where: {
                id: studentId,
            },
        });

        return data;
    }

    /**
       * 
       * @param studentId -  the student ID to search for
       * @param student -  the student object to save
       * @returns if a student ID is provided, or the first name and last name are provided plus one of the relsativesPhoneNumbers matchs, 
          then we will retrieve the existing student record from the database and update the student.
       */
    async findExistingStudent(studentId: number | null, student: Partial<SaveStudentDto>): Promise<Student> {
        let existingStudent;

        const { firstName, lastName, relativesPhoneNumbers } = student;
        try {
            existingStudent = await this.studentsRepository.findOne({
                relations: { relativesPhoneNumbers: true },
                where: [
                    { id: studentId },
                    {
                        firstName,
                        lastName,
                        relativesPhoneNumbers: {
                            phone: In([...relativesPhoneNumbers.map((phone) => phone.phone)]),
                        },
                    },
                ],
            });

            if (existingStudent) this.logger.log(`Student with ID ${studentId} was found.`);
            return existingStudent;
        } catch (error) {
            this.logger.error(`Error finding student with ID ${studentId}: ${error.message}`);
            throw error;
        }
    }

    async saveStudent(studentId: number | null, student: SaveStudentDto, schoolId: number): Promise<Student> {
        try {
            // If a student ID is provided, or the first name and last name are provided plus one of the relsativesPhoneNumbers matchs,
            // then we will retrieve the existing student record from the database and update the student.
            const existingStudent = await this.findExistingStudent(studentId, student);

            // Try to find an existing class with the same grade and class index
            const existingClass = await this.classesService.findOrCreateClassByGradeAndIndex(
                student.grade as SchoolGrades,
                Number(student.classIndex),
                schoolId,
            );
            const updatedStudent = {
                ...existingStudent,
                ...student,
                id: existingStudent?.id,
                schoolId,
                classId: Number(existingClass.id),
            };
            const savedStudent = await this.studentsRepository.save(updatedStudent);

            const message = existingStudent
                ? `Student ${studentId} updated`
                : `New student ${student.firstName} ${student.lastName} saved`;
            this.logger.log(`${message}: ${JSON.stringify(savedStudent)}`);

            return savedStudent;
        } catch (error) {
            // Log the error
            this.logger.error(`Error saving/updating student: ${error.message}`);

            // Rethrow the error as a custom error type
            throw new Error(`Error saving/updating student: ${error.message}`);
        }
    }

    async studentsByClass(schoolId: number, params: StudentByClassParams) {
        const data = await this.studentsRepository.find({
            select: {
                id: true,
                class: {
                    grade: true,
                    classIndex: true,
                },
                firstName: true,
                lastName: true,
                gender: true,
                gpCount: true,
            },
            where: {
                schoolId,
                class: {
                    grade: params.grade,
                    classIndex: params.classIndex,
                },
            },
            relations: {
                class: true,
            },
        });

        return data;
    }

    studentsByClassId(schoolId: number, classId: number) {
        return this.studentsRepository.find({
            select: { id: true, firstName: true, lastName: true, gpCount: true },
            where: { schoolId, class: { id: classId } },
            relations: { class: true },
        });
    }

    async getStudentsByGrades(schoolId: number, grades: SchoolGrades[]) {
        const students = await this.studentsRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                class: {
                    classIndex: true,
                    grade: true,
                },
            },
            where: {
                schoolId,
                class: {
                    grade: In(grades),
                },
            },
            relations: {
                class: true,
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });
        return groupNamesByAlphabet(students);
    }

    async getStudentsIdsOfStudyGroup(studyGroupId: number) {
        const students = await this.studentsRepository.find({
            select: {
                id: true,
            },
            where: {
                studyGroups: {
                    id: studyGroupId,
                },
            },
        });
        return students.map((student) => student.id);
    }

    async studentsByStudyGroup(schoolId: number, studyGroupId: number) {
        const data = await this.studentsRepository.find({
            select: {
                id: true,
                studyGroups: {
                    name: true,
                    schoolId: true,
                },
                firstName: true,
                lastName: true,
                gender: true,
                gpCount: true,
            },
            where: {
                schoolId,
                studyGroups: {
                    id: studyGroupId,
                },
            },
            relations: {
                studyGroups: true,
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });

        if (data.length && data[0].studyGroups[0].schoolId !== schoolId) {
            throw new UnauthorizedException();
        }
        return data;
    }

    async getAdminStudentsByStudyGroup(schoolId: number, studyGroupId: number) {
        const [results, count] = await this.studentsRepository.findAndCount({
            where: {
                schoolId,
                studyGroups: {
                    id: studyGroupId,
                },
            },
            relations: {
                class: true,
                studyGroups: true,
                relativesPhoneNumbers: true,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                phoneNumber: true,
                classId: true,
                relativesPhoneNumbers: true,
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });
        return { count, results };
    }

    async getStudentsOfSchool(schoolId: number, pageNumber: number, perPage: number, filterName: string) {
        const studentsQuery = this.studentsRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.class', 'class')
            .where('student.school_id=:schoolId', { schoolId })
            .orderBy('first_name')
            .addOrderBy('last_name')
            .offset((pageNumber - 1) * perPage)
            .limit(STUDENTS_FETCH_LIMIT);

        if (filterName)
            studentsQuery.andWhere('MATCH(student.first_name, student.last_name) AGAINST(:search IN BOOLEAN MODE)', {
                search: createSearchString(filterName),
            });

        return studentsQuery.getMany();
    }

    async getAdminStudentPaginated(
        schoolId: number,
        page: number,
        limit: number,
        filterName: string,
        grades?: string[],
    ) {
        const query = this.studentsRepository
            .createQueryBuilder('student')
            .leftJoinAndSelect('student.class', 'classObj')
            .leftJoinAndSelect('student.relativesPhoneNumbers', 'relatives')
            .select([
                'student.id',
                'student.firstName',
                'student.lastName',
                'student.gender',
                'student.classId',
                'student.phoneNumber',
                'relatives.phone',
                'classObj.grade',
                'classObj.classIndex',
                'student.schoolId',
            ])
            .where('student.school_id=:schoolId', { schoolId })
            .orderBy('student.firstName')
            .addOrderBy('student.lastName')
            .skip((page - 1) * limit)
            .take(limit);

        if (filterName) {
            query.andWhere(
                new Brackets((qb) => {
                    qb.where('MATCH(student.first_name, student.last_name) AGAINST(:search IN BOOLEAN MODE)', {
                        search: createSearchString(filterName),
                    });

                    if (/^\d+$/.test(filterName)) {
                        //Check if search only contains digits- if so, search for phone numbers.
                        qb.orWhere('relatives.phone like :phone', { phone: `%${filterName}%` });
                        qb.orWhere('student.phoneNumber like :phone', { phone: `%${filterName}%` });
                    }
                }),
            );

            const { classIndex, grade } = extractGradeAndClass(filterName);

            if (grade) {
                query.orWhere(
                    new Brackets((qb) => {
                        qb.where('student.school_id=:schoolId', { schoolId }); //because we use OR condition, we need to apply schoolId where.
                        qb.andWhere('classObj.grade = :grade', { grade: grade });

                        if (classIndex) {
                            qb.andWhere('classObj.classIndex = :classIndex', { classIndex });
                        }
                    }),
                );
            }
        }

        if (grades && grades.length > 0 && grades[0] !== 'loading') {
            query.andWhere(
                new Brackets((qb) => {
                    qb.andWhere('classObj.grade IN (:...grades)', { grades: grades });
                    if (grades.includes('WITHOUT')) {
                        qb.orWhere('classObj.grade IS NULL');
                    }
                }),
            );
        }

        const [results, count] = await query.getManyAndCount();

        return { count, results };
    }

    async getAdminStudentByClass(schoolId: number, classId: number) {
        const [results, count] = await this.studentsRepository.findAndCount({
            where: {
                schoolId,
                classId,
            },
            relations: {
                class: true,
                relativesPhoneNumbers: true,
            },
            select: ['id', 'firstName', 'lastName', 'gender', 'classId', 'phoneNumber'],
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });
        return { count, results };
    }

    /**
     * Move students to a given class and grade.
     * @param {string[]} ids - The IDs of the students to be moved.
     * @param {SchoolGrades} grade - The grade of the class.
     * @param {number} classIndex - The index of the class.
     * @param {number} schoolId - The ID of the school.
     * @returns {Promise<number>} The number of students moved.
     * @throws {Error} If students or class cannot be found.
     */
    async moveStudentsById(
        ids: string[],
        grade: SchoolGrades,
        classIndex: number,
        schoolId: number,
    ): Promise<{ affected: number }> {
        try {
            // Find the class with the given grade and classIndex
            const classInstance = await this.classesService.getSchoolClassId(grade, classIndex, schoolId);

            if (!classInstance) {
                this.logger.log(`Could not find the class: grade ${grade}, classIndex ${classIndex}`);
                throw new Error(`Could not find the class`);
            }

            if (!classInstance) {
                this.logger.log(`Could not find the class: grade ${grade}, classIndex ${classIndex}`);
                throw new Error(`Could not find the class`);
            }

            const updatedStudents = await this.studentsRepository.update(
                { id: In(ids), schoolId },
                { classId: classInstance.id },
            );

            // Return the number of students moved
            return { affected: updatedStudents.affected };
        } catch (error) {
            this.logger.error('🚀 ~ error', error);
            throw error;
        }
    }

    /**
     * Move students to a given class and grade, excluding specific students.
     * @param {AdminTableDto<StudentRow>} body - The request body containing selected students and parameters.
     * @param {number} schoolId - The ID of the school.
     * @param {SchoolGrades} grade - The grade of the class.
     * @param {number} classIndex - The index of the class.
     * @returns {Promise<number>} The number of students moved.
     * @throws {Error} If students or class cannot be found.
     */
    async moveStudentsExceptById(
        body: AdminTableDto<StudentRow>,
        schoolId: number,
        grade: SchoolGrades,
        classIndex: number,
    ): Promise<{ affected: number }> {
        try {
            const { filters, userSearch } = body.params;

            // Find the class with the given grade, classIndex, and schoolId
            const classInstance = await this.classesService.getSchoolClassId(grade, classIndex, schoolId);

            // Find all the classes id that match an array of filtered grades
            const filteredGrades = filters.map((filter) => filter.optionKey).flat() as SchoolGrades[];

            const classesIds = await this.classesService.getSchoolClassIdsByGrades(filteredGrades, schoolId);

            // Define the base query to find students to be moved
            const query = this.studentsRepository
                .createQueryBuilder('student')
                .update(Student)
                .set({ classId: classInstance.id })
                .where('school_id=:schoolId', { schoolId });

            if (body.selected.length !== 0) {
                query.andWhere('id NOT IN (:...selectedIds)', { selectedIds: body.selected });
            }

            if (classesIds.length !== 0) {
                query.andWhere('class_id IN (:...classesIds)', { classesIds });
            }

            // Apply search to the query
            if (userSearch) {
                query.andWhere('MATCH(first_name, last_name) AGAINST(:search IN BOOLEAN MODE)', {
                    search: createSearchString(userSearch),
                });
            }

            // Execute the query to find the students
            const result = await query.execute();

            // Return the number of students moved
            return { affected: result.affected };
        } catch (error) {
            this.logger.error('🚀 ~ error in moveStudentsExceptById', error);
            throw error;
        }
    }

    async deleteStudentsById(ids: string[]): Promise<number> {
        try {
            const students = await this.studentsRepository.find({
                where: {
                    id: In(ids),
                },
            });

            if (students.length <= 0) {
                this.logger.log(`Could not find students: ${ids}`);
                throw new Error(`Could not find students`);
            }

            const result = await this.studentsRepository.delete(ids);
            this.logger.log(`Deleted ${result.affected} students entities`);
            return result.affected;
        } catch (error) {
            this.logger.error('🚀 ~ error in moveStudentsExceptById', error);
            throw error;
        }
    }

    async deleteStudentsExceptById(
        ids: string[],
        userSearch: string,
        filters: FilterSetting<StudentRow>[],
        schoolId: number,
    ): Promise<DeleteResult> {
        try {
            // Create a query builder for deleting students
            const deleteStudentsQuery = this.studentsRepository
                .createQueryBuilder()
                .delete()
                .where('school_id = :schoolId', { schoolId });

            // Only add the "NOT IN" condition if the ids array is not empty
            if (ids.length > 0) {
                deleteStudentsQuery.andWhere('id NOT IN (:...ids)', { ids });
            }

            // If no search term or filters are provided, execute the delete query as is
            if (!userSearch && !filters.length) {
                const result = await deleteStudentsQuery.execute();
                this.logger.log(`Deleted ${result.affected} students entities`);
                return result;
            }

            // If search term or filters are provided, create a query builder for selecting students to be deleted
            const studentsToBeDeleted = this.studentsRepository
                .createQueryBuilder('student')
                .leftJoinAndSelect('student.class', 'classObj')
                .where('student.school_id=:schoolId', { schoolId })
                .andWhere('MATCH(student.first_name, student.last_name) AGAINST(:search IN BOOLEAN MODE)', {
                    search: createSearchString(userSearch),
                })
                .orderBy('first_name')
                .addOrderBy('last_name');

            // Apply filters to the students to be deleted query
            if (filters.length) {
                filters.forEach((element) => {
                    studentsToBeDeleted.andWhere('classObj.grade IN (:...grade)', { grade: element.optionKey });
                });
            }

            // Execute the students to be deleted query and extract their IDs
            const results = await studentsToBeDeleted.getMany();
            const studentIds = results?.map((student) => student.id);

            // Modify the delete query to only delete the selected students
            deleteStudentsQuery.andWhere(`id IN (${studentIds})`);

            // Execute the modified delete query and return the result
            const result = await deleteStudentsQuery.execute();
            this.logger.log(`Deleted ${result.affected} students entities with filters`);
            return result;
        } catch (error) {
            this.logger.error('🚀 ~ error', error);
            throw error;
        }
    }
    /**
     * Generates PDF reports for students based on the provided parameters. does so in batches of 20 students.
     * @param schoolId - ID of the school.
     * @param classId - ID of the class.
     * @param studentsIds - Array of student IDs.
     * @param dates - Object containing 'from' and 'to' dates for filtering the good points.
     * @param lang - Language for translation.
     * @param allStudents - Optional boolean flag indicating whether to fetch data for all students in the class.
     * @returns Promise<Array<Array<{ student: Student, buffer: ArrayBuffer }>>> - Promise that resolves to an array of arrays, each containing a student object and a PDF buffer.
     * @throws Error if failed to create students report.
     */
    async createStudentsReportPdf(
        schoolId: number,
        classId: number,
        studentsIds: number[],
        dates: { from: string; to: string },
        lang: Language,
        allStudents?: boolean,
    ) {
        const from = convertDateToLocalDate(dates.from);
        const to = convertDateToLocalDate(new Date(dates.to).setHours(23, 59));
        const studentsAndBuffers: Array<Array<{ student: Student; buffer: ArrayBuffer }>> = [];
        const translation = getTranslations(lang);
        const FILES_LIMIT = 20;

        try {
            //  for each student we want to fetch the right data from db and generatePdf
            const studentsGPData = await this.studentsRepository.find({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    goodPoint: {
                        teacher: { firstName: true, lastName: true },
                        gpText: true,
                        created: true,
                    },
                },
                relations: {
                    goodPoint: { teacher: true },
                    class: { teacher: true },
                    school: true,
                },
                where: {
                    schoolId,
                    classId,
                    id: allStudents ? null : In(studentsIds),
                    goodPoint: {
                        created: Between(from, to),
                    },
                },
                order: {
                    firstName: 'ASC',
                    lastName: 'ASC',
                },
            });

            /**
             *
             * @param studentsAndBuffersToBeBatched handles students array and adds pdf buffer to the array
             * @returns
             */
            const processEmailStudentsReportBatch = async (studentsAndBuffersToBeBatched: Student[]) => {
                const studentsBuffersBatch = await Promise.all(
                    studentsAndBuffersToBeBatched.map(async (student) => {
                        const studentName = `${student.firstName} ${student.lastName}`;
                        const className = `${translation.grades[student.class.grade]}${student.class.classIndex}`;
                        const teacherName = student.goodPoint[0]?.teacher
                            ? `${student.goodPoint[0].teacher.firstName} ${student.goodPoint[0].teacher.lastName}`
                            : '';

                        const gpData = student.goodPoint.map((gp) => ({
                            text: gp.gpText,
                            sender: `${gp.teacher.firstName} ${gp.teacher.lastName}`,
                        }));

                        const buffer: ArrayBuffer = await this.pdfService.generatePdf(
                            studentName,
                            className,
                            teacherName,
                            student.school.name,
                            gpData,
                            lang,
                        );

                        return { student, buffer };
                    }),
                );

                return studentsBuffersBatch;
            };
            // ------- End of handleEmailStudentsReportBatch

            // Process a batch of students in studentsGPData generator a pdf buffer for each batch and add it to the array of students and pdf buffers buffers
            for (let i = 0; i < studentsGPData.length; i += FILES_LIMIT) {
                const batchStudents = studentsGPData.splice(i, FILES_LIMIT);
                const batchResult = await processEmailStudentsReportBatch(batchStudents);
                studentsAndBuffers.push(batchResult);
            }
            if (studentsGPData.length > 0) {
                const remainingResult = await processEmailStudentsReportBatch(studentsGPData);
                studentsAndBuffers.push(remainingResult);
            }

            return studentsAndBuffers;
        } catch (error) {
            this.logger.error('Error occurred in createStudentsReportPdf:', error);
            throw new Error('Failed to create students report.');
        }
    }

    /**
     * Sends email with students' report PDFs to the specified email address.
     *
     * @param email - Email address to send the report to.
     * @param classId - ID of the class.
     * @param lang - Language for translation.
     * @param studentsAndBuffers - Array of arrays containing student objects and PDF buffers.
     * @throws Error if an error occurred while sending the email.
     */
    async SendMailStudentsReportPdf(
        email: string,
        classId: number,
        lang: Language,
        studentsAndBuffers: Array<Array<{ student: Student; buffer: ArrayBuffer }>>,
    ) {
        try {
            let attachments;
            const numberOfParts = studentsAndBuffers.length;
            const classObj = await this.classesService.getClassById(classId);

            const translation = getTranslations(lang);
            const { EXPORT_REPORT_EMAIL_HEADLINE, EXPORT_REPORT_EMAIL_TEXT, mails } = translation;

            studentsAndBuffers.forEach((studentsBuffersBatch, index) => {
                const defaultMessage = `${translation.mail_title} ${translation.grades[classObj.grade]}${classObj.classIndex}`;
                attachments = studentsBuffersBatch?.map((studentAndBuffer) => {
                    return {
                        filename: `${translation.mail_title}-${studentAndBuffer?.student?.firstName} ${
                            studentAndBuffer?.student?.lastName
                        }-${translation.grades[classObj.grade]}${classObj.classIndex}.pdf`,
                        content: studentAndBuffer.buffer,
                    };
                });

                let subject = `${translation.mail_title} ${translation.grades[classObj.grade]}${classObj.classIndex} - ${
                    mails.part
                } ${index + 1} ${mails.outOf} ${numberOfParts}`;
                if (numberOfParts === 1) {
                    subject = defaultMessage;
                }

                this.mailService.send({
                    from: translation.mails.gp,
                    subject: subject,
                    to: email,
                    attachments: attachments,
                    html: this.mailService.createHtmlMessage(
                        EXPORT_REPORT_EMAIL_TEXT,
                        EXPORT_REPORT_EMAIL_HEADLINE,
                        '',
                        lang,
                    ),
                });
            });
        } catch (error) {
            this.logger.error('Error occurred in SendMailStudentsReportPdf error', error);
        }
    }

    /**
     * Generate a zip archive containing student PDFs.
     *
     * @param {Array<Array<{ student: Student, buffer: ArrayBuffer }>>} arrayOfStudentsAndBuffers - Array of objects containing student information and corresponding buffers.
     * @param {Language} lang - The language code.
     */
    async generateZipArchive(
        arrayOfStudentsAndBuffers: Array<Array<{ student: Student; buffer: ArrayBuffer }>>,
        lang: Language,
    ) {
        const zip = new JSZip();
        const translations = getTranslations(lang);

        arrayOfStudentsAndBuffers.flatMap((arrayOfStudentAndBuffer) =>
            arrayOfStudentAndBuffer?.forEach((studentAndBuffer) => {
                if (studentAndBuffer) {
                    const name = `${translations.mail_title}-${studentAndBuffer?.student?.firstName} ${
                        studentAndBuffer?.student?.lastName
                    }-${translations.grades[studentAndBuffer?.student?.class?.grade]}${
                        studentAndBuffer?.student?.class?.grade
                    }.pdf`;
                    const pdfData = Buffer.from(studentAndBuffer.buffer);
                    zip.file(name, pdfData);
                    return name;
                }
                return null;
            }),
        );

        return await zip.generateAsync({ type: 'nodebuffer' });
    }

    async createStudentsReportXlsx(
        schoolId: number,
        classId: number,
        studentsIds: number[],
        dates: { from: string; to: string },
        lang: Language,
        allStudents?: boolean,
    ) {
        const studentsGPData = await this.studentsRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gpCount: true,
                goodPoint: {
                    teacher: { firstName: true, lastName: true },
                    gpText: true,
                    created: true,
                },
            },
            relations: { goodPoint: { teacher: true } },
            where: {
                schoolId,
                classId,
                id: allStudents ? null : In(studentsIds),
                goodPoint: {
                    created: Between(
                        convertDateToLocalDate(dates.from),
                        convertDateToLocalDate(new Date(dates.to).setHours(23, 59)),
                    ),
                },
            },
            order: {
                firstName: 'ASC',
                lastName: 'ASC',
            },
        });

        const formattedData = this.formatReportData(studentsGPData, lang);
        return createXlsxBuffer(formattedData, lang, [20, 20, 20, 80]);
    }

    async SendMailStudentsReportXlsx(email: string, classId: number, lang: Language, buffer: any) {
        const grade = await this.classesService.getClassById(classId);
        const translation = getTranslations(lang);
        const { EXPORT_REPORT_EMAIL_HEADLINE, EXPORT_REPORT_EMAIL_TEXT } = translation;

        this.mailService.send({
            from: translation.mails.gp,
            subject: `${translation.mail_title} ${translation.grades[grade.grade]}${grade.classIndex}`,
            to: email,
            attachments: [
                {
                    filename: `${translation.mail_title} ${translation.grades[grade.grade]}${grade.classIndex}.xlsx`,
                    content: buffer,
                },
            ],
            html: this.mailService.createHtmlMessage(EXPORT_REPORT_EMAIL_TEXT, EXPORT_REPORT_EMAIL_HEADLINE, '', lang),
        });
    }

    /**
     *
     * @method create translated object for xlsx table
     * @param {Student[]} data- query result
     * @param {Language} lang- user lang for translation
     * @returns translated {}[]
     */
    formatReportData(data: Student[], lang: Language) {
        const formattedData: object[] = [];
        const labels = translations[lang].ExportReportTableTranslation;
        data.forEach((val) => {
            val.goodPoint.forEach((goodPoint) => {
                formattedData.push({
                    [labels.name]: `${val.firstName} ${val.lastName}`,
                    [labels.sender]: `${goodPoint.teacher.firstName} ${goodPoint.teacher.lastName}`,
                    [labels.created]: goodPoint.created,
                    [labels.text]: goodPoint.gpText,
                });
            });
        });
        return formattedData;
    }

    /**
     * Uploads a list of students from an Excel sheet to the database.
     * @param sheet An array representing the Excel sheet.
     * @param schoolId The ID of the school associated with the students.
     * @returns A Promise that resolves to an array of the newly created students.
     */
    async uploadStudentsEXCEL(sheet: ExcelSheet<StudentHeaders>, schoolId: number) {
        /**
         * Insert students into db, check for duplicates and update on conflict, create classes and assign their ID's.
         * @returns
         */
        async function handleStudentsBatch(this: StudentService) {
            if (!studentsToInsert.length) return;

            this.logger.log(`~~~ Inserting ${studentsToInsert.length} students to school ${schoolId}`);

            const [classes, foundStudents] = await Promise.all([
                await this.classesService.findOrCreateByStrings(Array.from(classesSet), schoolId, 'object'),
                await this.studentsRepository.find({ where: studentsSearch, relations: ['relativesPhoneNumbers'] }),
            ]);

            // assign studentId for existing students;
            if (foundStudents.length) {
                updatedStudentsCount += foundStudents.length;
                let index = -1;
                for (const existingStudent of foundStudents) {
                    index = studentsToInsert.findIndex((student) => {
                        if (
                            student.firstName === existingStudent.firstName &&
                            student.lastName === existingStudent.lastName
                        ) {
                            if (
                                student.relativesPhoneNumbers.some((phoneElem) =>
                                    existingStudent.relativesPhoneNumbers.some((pe) => pe.phone === phoneElem.phone),
                                )
                            )
                                return true;
                        }
                        return false;
                    });

                    if (index !== -1) {
                        studentsToInsert[index].id = existingStudent.id;
                    }
                }
            }

            //assign classId to every student;
            for (let i = 0; i < studentsToInsert.length; i++) {
                const stud = studentsToInsert[i];
                studentsToInsert[i].classId = classes[stud.class.grade + '-' + stud.class.classIndex];
                delete studentsToInsert[i].class;
            }
            const res = await this.studentsRepository.save(studentsToInsert);
            this.logger.log('Created new Students students ' + res.length);
            (studentsToInsert = []), (studentsSearch = []);
        }
        // ------- End of handleStudentsBatch

        const classesSet = new Set<`${SchoolGrades}-${number}`>();

        let studentsToInsert: Partial<Student>[] = [];
        let studentsSearch: FindOptionsWhere<Student>[] = [];
        let updatedStudentsCount = 0;
        let row: (typeof sheet)[number];
        const LIMIT = 200;

        try {
            let gptTokens = 0;
            for (let i = 0; i < sheet.length; i++) {
                row = sheet[i];
                let { firstName, lastName, gender } = row;
                const { classNumber: rawClassIndex, grade: rawGrade, fullName } = row;

                if ((!firstName || !lastName) && fullName) {
                    const splitted = await splitName(fullName);
                    firstName = splitted.firstName;
                    lastName = splitted.lastName;
                    if (splitted.didUseGpt) {
                        gptTokens += splitted.tokensUsed;
                    }
                } else {
                    firstName = firstName.trim();
                    lastName = lastName.trim();
                }
                gender = translateGender(gender);
                if (!rawClassIndex && !rawGrade) throw new BadRequestException('CLASS_GRADE');

                const gradesAndClasses = extractGradeAndClass(rawGrade);
                const grade = gradesAndClasses.grade;
                let classIndex = gradesAndClasses.classIndex;

                classIndex = classIndex || Number(rawClassIndex);

                if (!grade || !classIndex) {
                    this.logger.error(
                        `Missing grade and classIndex for student: ${rawClassIndex}, ${rawGrade}, ${firstName}, ${fullName}`,
                    );
                    throw new BadRequestException('CLASS_GRADE');
                }
                classesSet.add(`${grade as SchoolGrades}-${classIndex}`);

                // --- Handle phone numbers
                const relativesPhoneNumbers = [];
                let tempPhone = '';

                for (let i = 1; i <= 4; i++) {
                    tempPhone = handlePhoneNumber(row[`phone_p${i}`]);
                    if (tempPhone) relativesPhoneNumbers.push({ phone: tempPhone });
                }

                //student phone
                tempPhone = handlePhoneNumber(row.studentPhone);
                const studentPhoneNumber = tempPhone ?? null;

                // --- Done handling phone numbers

                // Create a new student object to save later.
                studentsToInsert.push(
                    this.studentsRepository.create({
                        firstName,
                        lastName,
                        gender: gender as Gender,
                        relativesPhoneNumbers,
                        schoolId,
                        phoneNumber: studentPhoneNumber,
                        class: { classIndex, grade: grade as SchoolGrades },
                    }),
                );

                studentsSearch.push({
                    firstName,
                    lastName,
                    schoolId,
                    relativesPhoneNumbers: {
                        phone: In([...relativesPhoneNumbers.map((phone) => phone.phone)]),
                    },
                });

                if (i % LIMIT === 0 && i !== 0) {
                    await handleStudentsBatch.call(this);
                }
            } //------End of loop

            // --Insert all the records left in studentsToInsert;
            await handleStudentsBatch.call(this);

            this.logger.log(
                `Created ${sheet.length - updatedStudentsCount} students, updated ${updatedStudentsCount}; `,
            );

            //increment the school's gpt tokens
            await this.schoolService.incrementGptTokenCount(schoolId, gptTokens);

            return { updated: updatedStudentsCount, newRecords: sheet.length - updatedStudentsCount };
        } catch (error) {
            this.logger.error(`Error uploading students to school ${schoolId} from Excel sheet: ${error} `);
            throw error;
        }
    }

    async studentInSchool(studentId: Student['id'], schoolId: Student['schoolId']) {
        const student = await this.studentsRepository.findOne({ where: { id: studentId, schoolId } });
        if (student) return true;
        throw new ForbiddenException('No match - student school');
    }
    /**
     * Migration function to move phone numbers from the students table to the parent_phone table.
     * Existing phone numbers in the parent_phone table will be ignored.
     * This function is meant to be run only once as a migration.
     */
    async movePhoneNumbersToTable() {
        await this.studentsRepository
            .createQueryBuilder('student')
            .update()
            .set({ phoneNumber: () => 'phone_number_3' })
            .where('phone_number_3 is not null')
            .andWhere('phone_number_3 !=""')
            .execute();

        await this.studentsRepository.query(
            'INSERT IGNORE into parent_phone (student_id,phone) (select id,phone_number_1 from students where phone_number_1 is not null and phone_number_1!="")',
        );
        await this.studentsRepository.query(
            'INSERT IGNORE into parent_phone (student_id,phone) (select id,phone_number_2 from students where phone_number_2 is not null and phone_number_2!="")',
        );
        this.logger.debug('Done moving phone numbers to parent_phone table');
    }

    deleteSchoolStudents(schoolId: number) {
        return this.studentsRepository.delete({ schoolId });
    }

    /**
     *
     * @param classesIds
     * @returns Array of students first & last names and classId (sorted by grade and class index ASC) that didn't get good points during this month.
     */
    async getStudentsWithoutMonthlyGpsByClassIds(classesIds: number[]) {
        return this.studentsRepository
            .createQueryBuilder('student')
            .select(['student.firstName', 'student.lastName', 'student.classId'])
            .leftJoin(
                GoodPoint,
                'gp',
                'gp.studentId=student.id AND MONTH(gp.created) = MONTH(CURRENT_DATE()) AND YEAR(gp.created) = YEAR(CURRENT_DATE())',
            )
            .leftJoin(Classes, 'classes', 'student.classId = classes.id')
            .where('student.classId in (:...classesIds)', { classesIds })
            .having('COUNT(gp.id) = 0')
            .groupBy('student.id')
            .orderBy('classes.grade', 'ASC')
            .addOrderBy('classes.classIndex', 'ASC')
            .getMany();
    }

    /**
     * Set all students gpCount to zero for new year.
     * @param manager Transaction manager. This function runs only with transaction and as a part of new-year process.
     */
    async resetGpCount(manager: EntityManager) {
        return manager.getRepository(Student).update({}, { gpCount: 0 });
    }
}
