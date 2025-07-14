import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyGroup } from '../entities/study-group.entity';
import { In, Repository } from 'typeorm';
import { AdminAddOrEditStudyGroupDto } from 'src/common/dtos/admin-add-or-edit-study-groups.dto';
import { AdminTableDto } from 'src/common/dtos/admin-table.dto';
import { StudyGroupsRow } from 'src/common/types/study-groups-table-row.type';
import { Student } from 'src/entities';
import { SchoolGrades } from 'src/common/enums';

@Injectable()
export class StudyGroupService {
    constructor(
        @InjectRepository(StudyGroup)
        private readonly studyGroupRepository: Repository<StudyGroup>,
    ) {}

    async getAllSchoolStudyGroups(schoolId: number) {
        return await this.studyGroupRepository.find({
            where: {
                schoolId,
            },
            select: {
                studyGroupGrades: true,
            },
            relations: {
                studyGroupGrades: true,
            },
        });
    }

    async getAdminStudyGroups(schoolId: number) {
        //this will get us the study groups with their students, from the students's class
        //we will be able to get the grades of the students and return it as an array of grades of the study groups
        const studyGroups = await this.studyGroupRepository.find({
            where: {
                schoolId,
            },
            select: {
                id: true,
                name: true,
                teacher: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
                studyGroupGrades: true,
            },
            relations: {
                studyGroupGrades: true,
                teacher: true,
            },
        });
        return studyGroups.map((studyGroup) => {
            return {
                id: studyGroup.id,
                name: studyGroup.name,
                teacher: studyGroup.teacher,
                grades: studyGroup.grades,
            };
        });
    }

    getTeacherStudyGroups(teacherId: string, schoolId: number) {
        return this.studyGroupRepository.find({
            select: ['id', 'name'],
            where: { starredBy: { id: teacherId }, school: { id: schoolId } },
        });
    }

    async getStudyGroupDetails(id: number) {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                teacher: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
                studyGroupGrades: true,
            },
            relations: {
                studyGroupGrades: true,
                teacher: true,
            },
        });
        return {
            id: studyGroup.id,
            name: studyGroup.name,
            teacher: studyGroup.teacher && {
                id: studyGroup.teacher.id,
                label: `${studyGroup.teacher.firstName} ${studyGroup.teacher.lastName}`,
            },
            grades: studyGroup.grades,
        };
    }
    async groupRelatedToSchool(schoolId: number, groupId: number) {
        return Boolean(await this.studyGroupRepository.findOne({ where: { id: groupId, schoolId }, select: ['id'] }));
    }

    async addOrEditStudyGroup(body: AdminAddOrEditStudyGroupDto, schoolId: number) {
        if (body.id) {
            const oldStudyGroupGrades = (
                await this.studyGroupRepository.findOne({
                    where: { id: body.id },
                    select: {
                        studyGroupGrades: true,
                    },
                    relations: {
                        studyGroupGrades: true,
                    },
                })
            ).grades;

            const newGradesArray = body.studyGroupGrades.map((gradeObj) => gradeObj.grade);

            // the grades that were in the old array and not in the new
            const gradesDeleted = oldStudyGroupGrades.filter((grade) => !newGradesArray.includes(grade));
            gradesDeleted.length && (await this.removeStudentsFromStudyGroup(body.id, gradesDeleted, schoolId));
        }
        return this.studyGroupRepository.save({ ...body, schoolId });
    }

    /**
     *
     * @description Used to remove students from study group by grade.
     * We use it when we update group details, and removes existing grade (so we need to remove its students too).
     *
     */
    async removeStudentsFromStudyGroup(groupId: StudyGroup['id'], grades: SchoolGrades[], schoolId: number) {
        const studentsSubQuery = this.studyGroupRepository
            .createQueryBuilder()
            .select('student.id')
            .from(Student, 'student')
            .innerJoin('student.class', 'classroom', 'student.class_id = classroom.id')
            .where('classroom.grade IN (:grades)')
            .andWhere('student.schoolId = :schoolId')
            .andWhere('classroom.schoolId = :schoolId')
            .getQuery();

        return await this.studyGroupRepository
            .createQueryBuilder()
            .delete()
            .from('student_in_study_group')
            .where('studyGroupId = :groupId')
            .andWhere(`studentsId IN (${studentsSubQuery})`)
            .setParameter('groupId', groupId)
            .setParameter('grades', grades)
            .setParameter('schoolId', schoolId)
            .execute();
    }

    async addStudentsToStudyGroup(studentsIds: number[], studyGroupId: number) {
        const studyGroup = await this.studyGroupRepository.findOne({
            where: { id: studyGroupId },
            relations: ['students'],
        });

        if (!studyGroup) {
            throw new Error('Study group not found');
        }

        const existingStudentIds = studyGroup.students.map((student) => student.id);

        await this.studyGroupRepository.manager.transaction(async (transactionalEntityManager) => {
            await transactionalEntityManager
                .createQueryBuilder()
                .relation(StudyGroup, 'students')
                .of(studyGroup)
                .remove(existingStudentIds);

            await transactionalEntityManager
                .createQueryBuilder()
                .relation(StudyGroup, 'students')
                .of(studyGroup)
                .add(studentsIds);
        });

        return studyGroup;
    }

    async getAllStudyGroupsGrades(schoolId: number) {
        const studyGroups = await this.getAdminStudyGroups(schoolId);
        //array of grades arrays
        const grades = studyGroups.map((studyGroup) => studyGroup.grades);
        // the set make sure there will be no duplicates
        const flatGradesArray = [...new Set(grades.flat(1))];

        const sorted = flatGradesArray.sort((a, b) => Number(a) - Number(b));

        return sorted;
    }

    async deleteAdminStudyGroups(body: AdminTableDto<StudyGroupsRow>, schoolId: number) {
        const selected = body.selected.map((id) => Number(id));
        const userSearch = body.params.userSearch;
        const gradeFilter = body.params.filters[0];

        let deleteStudyGroupsQuery = this.studyGroupRepository
            .createQueryBuilder('studyGroup')
            .delete()
            .where('school_id=:schoolId', { schoolId });

        if (body.params.allChecked) {
            //the study groups that their teachers full names match the userSearch
            //if the userSearch is empty it will not affect the query
            const deleteByUserSearch = await this.studyGroupRepository
                .createQueryBuilder('studyGroup')
                .leftJoin('studyGroup.teacher', 'teacher')
                .select(['studyGroup.id'])
                .where('studyGroup.schoolId = :schoolId', { schoolId })
                .andWhere(`CONCAT(teacher.firstName, " ", teacher.lastName) LIKE :name`, { name: `%${userSearch}%` })
                .getMany()
                .then((studyGroups) => studyGroups.map((studyGroup) => studyGroup.id));

            //gets all the study groups that have the grade of the gradeFilter
            let deleteByGrades: any[] = [];
            if (gradeFilter && Array.isArray(gradeFilter.optionKey)) {
                const studyGroups = await this.studyGroupRepository.find({
                    select: ['id'],
                    where: {
                        schoolId,
                        studyGroupGrades: {
                            grade: In(gradeFilter.optionKey),
                        },
                    },
                    relations: {
                        studyGroupGrades: true,
                    },
                });
                deleteByGrades = studyGroups.map((studyGroup) => {
                    return studyGroup.id;
                });
            }

            if (userSearch) {
                deleteStudyGroupsQuery = deleteStudyGroupsQuery.andWhere('id IN (:...deleteByUserSearch)', {
                    deleteByUserSearch,
                });
            }

            if (gradeFilter) {
                deleteStudyGroupsQuery = deleteStudyGroupsQuery.andWhere('id IN (:...deleteByGrades)', {
                    deleteByGrades,
                });
            }

            if (selected.length > 0) {
                deleteStudyGroupsQuery = deleteStudyGroupsQuery.andWhere('id NOT IN (:...selected)', { selected });
            }

            await deleteStudyGroupsQuery.execute();
        } else {
            deleteStudyGroupsQuery = deleteStudyGroupsQuery.andWhere('id IN (:...selected)', { selected });
            await deleteStudyGroupsQuery.execute();
        }
    }
}
