import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ADMIN_CLASSES_FETCH_LIMIT_SERVER } from '../common/consts/fetch-limits-admin';
import { DateForReportDto } from 'src/common/dtos';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { Language, SchoolGrades } from 'src/common/enums';
import { extractGradeAndClass, splitName, translateGrade } from 'src/common/functions';
import { ExcelSheet } from 'src/common/pipes/excel-validator.pipe';
import { ClassesHeaders } from 'src/common/translations/translationObjects';
import { ClassesTableRow } from 'src/common/types/classes-table-row.type';
import { Classes, Staff, Student } from 'src/entities';
import { SchoolService } from 'src/school/school.service';
import { StaffService } from 'src/staff/staff.service';
import { StudentService } from 'src/student/student.service';
import { StudyGroupService } from 'src/study-group/study-group.service';
import { Brackets, EntityManager, In, Repository } from 'typeorm';
@Injectable()
export class ClassesService {
    private readonly logger = new Logger(ClassesService.name);

    constructor(
        @InjectRepository(Classes) private classesRepository: Repository<Classes>,
        @Inject(forwardRef(() => StudentService))
        private StudentsService: StudentService,
        @Inject(forwardRef(() => StaffService))
        private staffService: StaffService,
        private studyGroupService: StudyGroupService,
        private schoolService: SchoolService,
    ) {}

    async fetchClasses(schoolId: number) {
        const classes = await this.classesRepository
            .createQueryBuilder('class')
            .leftJoinAndSelect('class.teacher', 'teacher')
            .where('school_id=:id', { id: schoolId })
            .getMany();
        //hiding the id of the teacher (maybe find a better way )
        return classes.map((cls) => {
            if (cls.teacher) cls.teacher.id = null;
            return cls;
        });
    }

    async getSchoolClassId(grade: SchoolGrades, classIndex: number, schoolId: number) {
        return await this.classesRepository.findOne({ where: { grade, classIndex, schoolId }, select: ['id'] });
    }

    async getSchoolClassIdsByGrades(ArrayGrade: SchoolGrades[], schoolId: number): Promise<Classes['id'][]> {
        const ids = await this.classesRepository.find({
            where: { grade: In(ArrayGrade), schoolId },
            select: ['id'],
        });

        return ids.map((item) => item.id);
    }

    async adminFetchAllClasses(schoolId: number) {
        const results = await this.classesRepository.find({
            select: {
                id: true,
                grade: true,
                classIndex: true,
                teacher: {
                    firstName: true,
                    lastName: true,
                    id: true,
                },
            },
            where: { schoolId },
            order: {
                grade: 'ASC',
                classIndex: 'ASC',
            },
            relations: ['teacher'],
        });
        return { results, count: results.length };
    }

    async getClassDetails(id: number, schoolId: number) {
        const classDetails = await this.classesRepository.findOne({
            where: { id, schoolId },
            select: {
                id: true,
                grade: true,
                classIndex: true,
                teacher: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            relations: ['teacher'],
        });
        return {
            id: classDetails.id,
            grade: classDetails.grade,
            classIndex: classDetails.classIndex,
            teacher: classDetails.teacher && {
                id: classDetails.teacher.id,
                label: `${classDetails.teacher.firstName} ${classDetails.teacher.lastName}`,
            },
        };
    }

    async adminFetchClasses(
        userId: string,
        grade: SchoolGrades | string,
        cIndex: number,
        fetchedClasses: number[],
        schoolId: number,
        tName: string,
    ) {
        let classes = this.classesRepository
            .createQueryBuilder('class')
            .select([
                'class.classIndex',
                'class.id',
                'class.grade',
                'first_name AS teacherFirstName',
                'last_name AS teacherLastName',
                'gender ',
            ])
            .leftJoinAndSelect('class.teacher', 'Teacher')
            .where('class.school_id=:schoolId', { schoolId });

        if (fetchedClasses.length) classes = classes.andWhere(`class.id NOT IN (${fetchedClasses.join(',')})`);

        //teacher name is optional
        //idk why the client would send null as a string, but it happens...
        if (tName && tName !== 'null')
            classes = classes
                .andWhere(
                    new Brackets((qb) =>
                        qb
                            .where('CONCAT(Teacher.first_name," ",Teacher.last_name) REGEXP :tName')
                            .orWhere('Teacher.last_name REGEXP :tName')
                            .orWhere('Teacher.first_name REGEXP :tName'),
                    ),
                )
                .setParameter('tName', tName);

        if (grade && grade !== 'null') classes = classes.andWhere('grade=:grade', { grade });
        if (cIndex && !isNaN(cIndex)) classes = classes.andWhere('class_index=:cIndex', { cIndex });
        classes = classes
            .orderBy('class.grade')
            .addOrderBy('class.class_index', 'ASC')
            .limit(ADMIN_CLASSES_FETCH_LIMIT_SERVER);

        const res = await classes.getMany();

        return res;
    }

    async createClassesReportXlsx(schoolId: number, classId: number, dates: DateForReportDto, lang: Language) {
        return this.StudentsService.createStudentsReportXlsx(schoolId, classId, [], dates, lang, true);
    }

    async allStudentGradeUp(manager: EntityManager) {
        //removes class from twelve grade students
        await this.StudentsService.updateTwelveGradeStudents(manager);

        //removing the 12th grade classes
        const removeClasses = manager.createQueryBuilder(Classes, 'class').delete().where('grade=12');

        await removeClasses.execute();

        try {
            await manager.query('ALTER TABLE classes DROP INDEX IDX_9a1024736a466e0361b226cef9');

            const updateGrade = manager
                .createQueryBuilder(Classes, 'class')
                .update()
                .set({ grade: () => 'grade + 1' })
                .where('grade IS NOT NULL');

            await updateGrade.execute();
            await manager.query(
                'CREATE UNIQUE INDEX `IDX_9a1024736a466e0361b226cef9` on `classes` (`class_index`,`grade`,`school_id`)',
            );
        } catch (err) {
            this.logger.error('Error in gradeUP:' + err);

            // If could not update- rebuild index.
            if (typeof err.sql === 'string' && err.sql.includes('`grade` IS NOT NULL')) {
                await this.classesRepository.query(
                    'CREATE UNIQUE INDEX `IDX_9a1024736a466e0361b226cef9` on `classes` (`class_index`,`grade`,`school_id`)',
                );
            }
            throw err;
        }
        return true;
    }

    async adminAddClasses(classes: ExcelSheet<ClassesHeaders>, headerLang: Language, schoolId: number) {
        const newClasses = await Promise.all(
            classes.map(async (classroom) => {
                const grade = await translateGrade(classroom.grade);
                //class_index stays the same ig(number
                const classIndex = Number(classroom.classNumber);
                //find the classes' teacher -based on first and last name and the current schoolId
                const firstName = classroom.firstName;
                const lastName = classroom.lastName;
                const teacher = await this.staffService.findTeacherWithSchool({ lastName, firstName }, schoolId);
                if (!teacher) throw new BadRequestException('no teacher was found');
                return { classIndex, grade, teacherId: teacher.id, schoolId };
            }),
        );

        return await this.classesRepository
            .createQueryBuilder()
            .insert()
            .into(Classes)
            .values(newClasses)
            .orUpdate(['teacher_id'], ['class_index', 'grade', 'school_id'])
            .updateEntity(false)
            .execute();
    }

    async adminAddOrEditClassForm(form: Partial<Classes>) {
        return this.classesRepository
            .upsert(
                { ...form },
                {
                    conflictPaths: ['classIndex', 'grade', 'schoolId'],
                },
            )
            .catch((e) => {
                if (e.code === 'ER_DUP_ENTRY') throw new BadRequestException('class already exists');
            });
    }

    async assignHomeTeacher(
        classInfo: { grade: SchoolGrades; classIndex: number },
        teacherInfo: { firstName: string; lastName: string },
        schoolId: number,
    ) {
        //find the teacher by school,first and last name
        const teacher = await this.staffService.findTeacherWithSchool({ ...teacherInfo }, schoolId);
        return await this.classesRepository
            .createQueryBuilder()
            .insert()
            .into(Classes)
            .values({ teacherId: teacher.id, schoolId, ...classInfo })
            .orUpdate(['teacher_id'], ['class_index', 'grade', 'school_id'])
            .updateEntity(false)
            .execute();
    }

    getTeacherStarredClasses(teacherId: string, schoolId: number) {
        return this.classesRepository.find({
            select: ['id', 'grade', 'classIndex'],
            where: {
                starredUserClasses: {
                    userId: teacherId,
                },
                school: { id: schoolId },
            },
            relations: { starredUserClasses: true },
        });
    }

    async getAllSchoolClasses(schoolId: number): Promise<{
        classes: Classes[];
        grades: string[];
        studyGroups: { id: number; name: string; grades: SchoolGrades[] }[];
    }> {
        const [classes, groups] = await Promise.all([
            this.classesRepository.find({
                select: { id: true, grade: true, classIndex: true },
                where: {
                    schoolId,
                },
                order: {
                    grade: 'ASC',
                    classIndex: 'ASC',
                },
            }),
            this.studyGroupService.getAllSchoolStudyGroups(schoolId),
        ]);
        const studyGroups = groups.map((val) => {
            return { id: val.id, name: val.name, grades: val.grades };
        });
        return { classes, grades: this.getGradeFilterArray(classes), studyGroups: studyGroups };
    }

    async getPopulatedSchoolClasses(schoolId: number): Promise<Classes[]> {
        return this.classesRepository
            .createQueryBuilder('cls')
            .select('cls.id')
            .addSelect('cls.grade')
            .addSelect('cls.classIndex')
            .innerJoin(Student, 'st', 'st.classId = cls.id')
            .where('cls.schoolId = :schoolId', { schoolId })
            .andWhere('st.schoolId= :schoolId', { schoolId })
            .getMany();
    }

    async classRelatedToSchool(schoolId: number, classId: number) {
        return Boolean(await this.classesRepository.findOne({ where: { id: classId, schoolId }, select: ['id'] }));
    }

    async findOrCreateByStrings(
        classesArr: `${SchoolGrades}-${number}`[],
        schoolId: number,
        type: 'object',
    ): Promise<Record<`${SchoolGrades}-${number}`, Classes['id']>>;
    async findOrCreateByStrings(
        classesArr: `${SchoolGrades}-${number}`[],
        schoolId: number,
        type?: 'array',
    ): Promise<Classes[]>;
    async findOrCreateByStrings(
        classesArr: `${SchoolGrades}-${number}`[],
        schoolId: number,
        type: 'object' | 'array' = 'array',
    ) {
        const values: Partial<Classes>[] = classesArr.map((str) => {
            const [grade, classIndex] = str.split('-');
            return { grade: grade as SchoolGrades, classIndex: Number(classIndex), schoolId, id: null };
        });

        await this.classesRepository.createQueryBuilder().insert().into(Classes).values(values).orIgnore().execute();

        const classes = await this.classesRepository
            .createQueryBuilder('classes')
            .select(['classes.id', 'classes.grade', 'classes.classIndex'])
            .where('school_id = :schoolId', { schoolId })
            .andWhere("CONCAT(grade, '-',class_index) in (:...classesArr)", { classesArr })
            .getMany();

        if (type === 'array') return classes;

        const classObg: Record<`${SchoolGrades}-${number}`, Classes['id']> = {};
        classes.forEach((cls) => {
            classObg[`${cls.grade}-${cls.classIndex}`] = cls.id;
        });
        return classObg;
    }

    async findOrCreateClassByGradeAndIndex(
        grade: SchoolGrades,
        classIndex: number,
        schoolId: number,
    ): Promise<Classes> {
        try {
            // Search for an existing class with the given grade, class index, and school ID
            let existingClass = await this.classesRepository.findOne({
                where: {
                    grade,
                    classIndex,
                    schoolId,
                },
            });

            // If no existing class was found, create a new one and return it
            if (!existingClass) {
                existingClass = await this.classesRepository.save({
                    grade,
                    classIndex,
                    schoolId,
                });
            }

            return existingClass;
        } catch (error) {
            this.logger.error(`theres has been an error upserting  the class: ${error}`);
            return error;
        }
    }

    async updateTeacherClasses(
        schoolId: number,
        teacherId: string,
        classes?: { grade: SchoolGrades; classIndex: number }[],
    ) {
        await this.classesRepository.update({ teacherId, schoolId }, { teacherId: null });

        if (classes.length) {
            const query = this.classesRepository.createQueryBuilder('classes').update().set({ teacherId });

            for (let i = 0; i < classes.length; i++) {
                const c = classes[i];
                query.orWhere(
                    new Brackets((qb) => {
                        qb.where(`classes.school_id = :schoolId`, { schoolId });
                        qb.andWhere(`classes.grade = :grade${i}`, { [`grade${i}`]: c.grade });
                        qb.andWhere(`classes.class_index = :classIndex${i}`, { [`classIndex${i}`]: c.classIndex });
                    }),
                );
            }
            await query.execute();
        }
    }

    private getGradeFilterArray(classList: Classes[]) {
        if (!classList) return [];
        const arr: string[] = [];
        classList.map((val: Classes) => {
            arr.push(val.grade);
        });
        return Array.from(new Set(arr)).sort((a, b) => Number(a) - Number(b));
    }

    getClassById(id: number) {
        return this.classesRepository.findOne({ where: { id } });
    }

    deleteSchoolClasses(schoolId: number) {
        return this.classesRepository.delete({ schoolId });
    }

    async getSchoolGradeRange(schoolId: number): Promise<{ smallestGrade: SchoolGrades; largestGrade: SchoolGrades }> {
        //get smallest and biggest grade
        const grade = await this.classesRepository
            .createQueryBuilder('cls')
            .select('MIN(CAST(cls.grade AS DECIMAL))', 'smallestGrade')
            .addSelect('MAX(CAST(cls.grade AS DECIMAL))', 'largestGrade')
            .where('cls.schoolId = :schoolId', { schoolId })
            .getRawOne();
        //if there are no classes in the school return null
        if (!grade.smallestGrade) return null;
        return { smallestGrade: grade.smallestGrade, largestGrade: grade.largestGrade };
    }

    async detachUserFromClasses(teacherId: string, schoolId: number) {
        return this.classesRepository
            .createQueryBuilder()
            .update()
            .set({ teacher: null })
            .where('teacherId = :teacherId', { teacherId })
            .andWhere('schoolId = :schoolId', { schoolId })
            .execute();
    }

    async deleteAdminClasses(body: AdminTableDto<ClassesTableRow>, schoolId: number) {
        const selected = body.selected.map((id) => Number(id));
        const userSearch = body.params.userSearch;
        const gradeFilter = body.params.filters[0];

        let deleteClassesQuery = this.classesRepository
            .createQueryBuilder('class')
            .delete()
            .where('school_id=:schoolId', { schoolId });

        if (body.params.allChecked) {
            //the classes that their teachers full names match the userSearch
            //if the userSearch is empty it will not affect the query
            const classesToDelete = await this.classesRepository
                .createQueryBuilder('class')
                .leftJoin('class.teacher', 'teacher')
                .select(['class.id'])
                .where('class.schoolId = :schoolId', { schoolId })
                .andWhere(`CONCAT(teacher.firstName, " ", teacher.lastName) LIKE :name`, { name: `%${userSearch}%` })
                .getMany()
                .then((classes) => classes.map((cls) => cls.id));

            if (userSearch) {
                deleteClassesQuery = deleteClassesQuery.andWhere('id IN (:...classesToDelete)', { classesToDelete });
            }

            if (selected.length > 0) {
                deleteClassesQuery = deleteClassesQuery.andWhere('id NOT IN (:...selected)', { selected });
            }

            if (gradeFilter) {
                deleteClassesQuery = deleteClassesQuery.andWhere('grade IN (:...grades)', {
                    grades: gradeFilter.optionKey,
                });
            }

            deleteClassesQuery.execute();
        } else {
            deleteClassesQuery = deleteClassesQuery.andWhere('id IN (:...selected)', { selected });
            deleteClassesQuery.execute();
        }
    }

    async uploadClassesEXCEL(sheet: ExcelSheet<ClassesHeaders>, schoolId: number) {
        let gptTokens = 0;
        const classesToInsert: Partial<Classes>[] = [];
        let updatedClassesCount = 0;
        let row: (typeof sheet)[number];

        try {
            for (let i = 0; i < sheet.length; i++) {
                row = sheet[i];

                const { classNumber: rawClassIndex, grade: rawGrade, fullName, username } = row;
                let { firstName, lastName } = row;

                if ((!firstName || !lastName) && !username && fullName) {
                    const splitted = await splitName(fullName);
                    firstName = splitted.firstName;
                    lastName = splitted.lastName;
                    if (splitted.didUseGpt) {
                        gptTokens += splitted.tokensUsed;
                    }
                }
                if (firstName && lastName) {
                    firstName = firstName.trim();
                    lastName = lastName.trim();
                }

                if (!rawClassIndex && !rawGrade) throw new BadRequestException('CLASS_GRADE');

                const gradesAndClasses = extractGradeAndClass(rawGrade);
                const grade = gradesAndClasses.grade;
                let classIndex = gradesAndClasses.classIndex;

                classIndex = classIndex || Number(rawClassIndex);

                if (!grade || !classIndex) {
                    throw new BadRequestException('CLASS_GRADE');
                }

                let foundTeacher;
                if (username || fullName || (firstName && lastName)) {
                    foundTeacher = await this.classesRepository.manager
                        .getRepository(Staff)
                        .findOneBy(username ? { username } : { firstName: firstName, lastName: lastName });
                }

                const foundClass = await this.classesRepository.findOneBy({ grade, classIndex, schoolId });

                // Create a new classes object to save later.
                classesToInsert.push({
                    id: foundClass?.id,
                    grade,
                    classIndex,
                    schoolId,
                    teacher: foundTeacher,
                });
            } //------End of loop

            classesToInsert.map((classObj) => (classObj.id ? updatedClassesCount++ : ''));
            const newClassesCount = classesToInsert.length - updatedClassesCount;

            await this.classesRepository.save(classesToInsert);
            //increment the school's gpt tokens
            await this.schoolService.incrementGptTokenCount(schoolId, gptTokens);

            this.logger.log(`Created ${newClassesCount} classes, updates ${updatedClassesCount} `);

            return { updated: updatedClassesCount, newRecords: newClassesCount };
        } catch (error) {
            this.logger.error(`Error uploading classes to school ${schoolId} from Excel sheet: ${error} `);
            throw error;
        }
    }
}
