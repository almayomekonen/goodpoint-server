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

    // NEW: Check if school exists
    async checkIfSchoolExists(schoolId: number): Promise<boolean> {
        try {
            const result = await this.userSchoolRepository.manager.query(
                'SELECT id FROM school WHERE id = ? AND deletedAt IS NULL',
                [schoolId],
            );
            return result && result.length > 0;
        } catch (error) {
            console.error('Error checking school existence:', error);
            return false;
        }
    }

    // NEW: Enhanced connectUserToSchool with better error handling
    async connectUserToSchoolSafe(roleId: RoleIds, schoolId: number, userId: string): Promise<boolean> {
        try {
            // Check if association already exists
            const existing = await this.userSchoolRepository.findOne({
                where: { userId, schoolId },
                withDeleted: true,
            });

            if (existing && !existing.deletedAt) {
                console.log(`User-school association already exists: ${userId} -> ${schoolId}`);
                return true;
            }

            if (existing && existing.deletedAt) {
                // Restore soft-deleted association
                console.log(`Restoring soft-deleted association: ${userId} -> ${schoolId}`);
                await this.userSchoolRepository.restore({ userId, schoolId });
                await this.userSchoolRepository.update({ userId, schoolId }, { roleId });
                return true;
            }

            // Create new association
            console.log(`Creating new user-school association: ${userId} -> ${schoolId} with role ${roleId}`);
            await this.userSchoolRepository.save({ roleId, schoolId, userId });
            return true;
        } catch (error) {
            console.error(`Error connecting user ${userId} to school ${schoolId}:`, error);
            return false;
        }
    }

    async softDeleteUserSchoolRelation(schoolId: number) {
        return this.userSchoolRepository.softDelete({ schoolId });
    }

    async getNumberOfTeachersInSchool(schoolId: number) {
        return this.userSchoolRepository.count({
            where: { schoolId, roleId: RoleIds.TEACHER },
        });
    }

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

    async removeAdmin(schoolId: number, userId: string) {
        this.userSchoolRepository.delete({ schoolId, userId, roleId: RoleIds.ADMIN });
        return userId;
    }
}
