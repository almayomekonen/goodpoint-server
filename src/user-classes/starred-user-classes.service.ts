import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StarredActions, starredActions } from 'src/common/consts/starredActions';
import { StarredUserClasses } from 'src/entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class StarredUserClassesService {
    private readonly logger = new Logger(StarredUserClassesService.name);

    constructor(
        @InjectRepository(StarredUserClasses)
        private userStarredClassesRepository: Repository<StarredUserClasses>,
    ) {}

    async removeTeacherClassesRelations(teacherId: string, classIds: number[]) {
        try {
            await this.userStarredClassesRepository.delete({
                user: { id: teacherId },
                classroom: { id: In(classIds) },
            });
        } catch (error) {
            this.logger.error("error in removing Teacher's Classes Relations" + error);
        }
    }

    async findUserClassIds(userId: string): Promise<StarredUserClasses[]> {
        return await this.userStarredClassesRepository.find({
            where: {
                userId: userId,
            },
            select: {
                classId: true,
            },
        });
    }

    async addOrRemoveClassForUser(classId: number, userId: string, action: StarredActions) {
        try {
            if (action === starredActions.add) {
                await this.userStarredClassesRepository
                    .createQueryBuilder()
                    .insert()
                    .values({ classId, userId })
                    .execute();
            } else {
                await this.userStarredClassesRepository
                    .createQueryBuilder()
                    .delete()
                    .where('classId = :classId', { classId })
                    .andWhere('userId = :userId', { userId })
                    .execute();
            }
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Fail');
        }
    }
}
