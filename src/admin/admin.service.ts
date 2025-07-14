import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AdminActionsService } from 'src/admin-actions/admin-actions.service';
import { ArchivedGoodPointService } from 'src/archived-good-point/archived-good-point.service';
import { ClassesService } from 'src/classes/classes.service';
import { GoodPointService } from 'src/good-point/good-point.service';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    constructor(
        private readonly classesService: ClassesService,
        private readonly archivedService: ArchivedGoodPointService,
        private readonly adminActionsService: AdminActionsService,
        private readonly goodPointsService: GoodPointService,
        private readonly studentService: StudentService,
    ) {}

    async startNewYear(operatingAdminId: string) {
        this.logger.log('Running new year script');

        if (!(await this.adminActionsService.canRunNewYear()))
            throw new BadRequestException('You ran this script lately');

        await this.adminActionsService.createTransaction(async (manager) => {
            this.logger.log('Grade up');
            await this.classesService.allStudentGradeUp(manager);

            this.logger.log('Move to archive');
            await this.archivedService.insertGoodPointsToArchive(manager);

            this.logger.log('Delete from good_points');
            await this.goodPointsService.deleteAllGoodPoints(manager);
            //TODO move good points reactions?

            this.logger.log('Update gpCount to zero');
            await this.studentService.resetGpCount(manager);

            this.logger.log('Update admin setting success:');
            await this.adminActionsService.updateGradeUpDate(manager, operatingAdminId);

            return manager;
        });

        this.logger.log('Done running new year script');
    }
}
