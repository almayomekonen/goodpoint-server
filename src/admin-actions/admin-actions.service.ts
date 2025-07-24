import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuperAdminActions } from 'src/common/enums/super-admin-actions.enum';
import { AdminActions } from 'src/entities';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class AdminActionsService {
    constructor(
        @InjectRepository(AdminActions)
        private readonly AdminActionsRepository: Repository<AdminActions>,
    ) {}

    async updateGradeUpDate(manager: EntityManager, adminId: string) {
        return manager
            .getRepository(AdminActions)
            .save({ actionType: SuperAdminActions.NEW_YEAR, operatingAdminId: adminId });
    }

    createTransaction(runInTransaction: (manager: EntityManager) => Promise<any>) {
        return this.AdminActionsRepository.manager.transaction(runInTransaction);
    }

    async canRunNewYear() {
        const instance = await this.AdminActionsRepository.findOne({
            where: { actionType: SuperAdminActions.NEW_YEAR },
            order: { created: 'DESC' },
        });

        if (!instance) {
            return true;
        }

        const daysDiff = (Date.now() - instance.created.getTime()) / (1000 * 3600 * 24);

        if (daysDiff > 60) return true;

        return false;
    }
}
