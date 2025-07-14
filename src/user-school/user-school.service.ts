import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleIds } from 'src/common/enums/role-ids.enum';
import { UserSchool } from 'src/entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class UserSchoolService {
    constructor(@InjectRepository(UserSchool) private userSchoolRepository: Repository<UserSchool>) {}

    removeUserSchoolRelation(userId: string, schoolId: number) {
        return this.userSchoolRepository.delete({ user: { id: userId }, school: { id: schoolId } });
    }

    /**
     *
     * @param userId the user's id
     * @returns the school id's of all the schools the user is related with
     */
    async findUserSchoolIds(userId: string, checkSchoolName: boolean = false): Promise<UserSchool[]> {
        const userSchools = await this.userSchoolRepository.find({
            where: {
                userId: userId,
            },
            select: {
                schoolId: true,
                roleId: true,
                school: { name: checkSchoolName },
            },
            relations: {
                school: checkSchoolName,
            },
        });
        if (userSchools.length === 0) [];
        return userSchools;
    }

    /**
        Finds teacher IDs with matching school.
        @param {string[]} teacherIds - Array of teacher IDs to search for.
        @param {number} adminsSchoolId - School ID of the admin.
        @returns {Promise<string[]>} - Promise that resolves to an array of matching teacher IDs.
        @description This function retrieves the teacher IDs that belong to the same school as the admin, ensuring data security and preventing unauthorized deletion of users from different schools.
        It queries the userSchoolRepository using the provided teacher IDs and admin's school ID to find matching user school records.
        The function returns an array of matching teacher IDs. If any mismatches are detected, an error is logged.
    */
    async findTeacherIdsWithMatchingSchool(teacherIds: string[], adminsSchoolId: number): Promise<string[]> {
        const teachersSchoolIds = await this.userSchoolRepository.find({
            select: ['userId'],
            where: {
                userId: In(teacherIds),
                schoolId: adminsSchoolId,
            },
        });

        const matchingTeacherIds = teachersSchoolIds.map((val) => val.userId);

        const mismatchedTeacherIds = teacherIds.filter((teacherId) => !matchingTeacherIds.includes(teacherId));

        if (mismatchedTeacherIds.length > 0) {
            throw new Error('Mismatch detected: Admin and teacher(s) belong to different schools');
        }

        return matchingTeacherIds;
    }

    async checkIfUserRelatedToSchool(schoolId: number, userId: string) {
        const res = await this.userSchoolRepository.findOne({ where: { schoolId, userId }, select: ['userId'] });
        return Boolean(res);
    }
    connectUserToSchool(roleId: RoleIds, schoolId: number, userId: string) {
        this.userSchoolRepository.save({ roleId, schoolId, userId });
    }

    async softDeleteUserSchoolRelation(schoolId: number) {
        return this.userSchoolRepository.softDelete({ schoolId });
    }

    /**
     *
     * @param schoolId
     * @returns the number of teachers in the school
     */
    async getNumberOfTeachersInSchool(schoolId: number) {
        return this.userSchoolRepository.count({
            where: { schoolId, roleId: RoleIds.TEACHER },
        });
    }

    /**
     * @param schoolId The id of the school
     * @returns All the admins (user with role =ADMIN) from the selected school, used for the school info page
     */
    async getAdminsOfSchool(schoolId: number) {
        return this.userSchoolRepository
            .createQueryBuilder('userSchool')
            .select([
                'user.id as id',
                'user.firstName as firstName',
                'user.lastName as lastName',
                'user.username as username',
                'userSchool.schoolId as schoolId',
            ])
            .leftJoin('userSchool.user', 'user')
            .where('userSchool.schoolId = :schoolId', { schoolId })
            .andWhere('userSchool.roleId = :roleId', { roleId: RoleIds.ADMIN })
            .getRawMany();
    }

    /**This is a super admin function used to delete an admin
     *
     * @param schoolId The id of the school
     * @param userId The id of the will be removed admin
     * @returns
     */
    async removeAdmin(schoolId: number, userId: string) {
        this.userSchoolRepository.delete({ schoolId, userId, roleId: RoleIds.ADMIN });
        return userId;
    }
}
