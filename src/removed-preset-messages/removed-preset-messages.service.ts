import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RemovedPresetMessages } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RemovedPresetMessagesService {
    constructor(
        @InjectRepository(RemovedPresetMessages) private removedPmsRepository: Repository<RemovedPresetMessages>,
    ) {}

    async addRemovedPM(pmInfo: Partial<RemovedPresetMessages>): Promise<RemovedPresetMessages> {
        const newRemovedPm = this.removedPmsRepository.create({ ...pmInfo });
        return this.removedPmsRepository.save(newRemovedPm);
    }

    async addRemovedPMS(pmsInfo: Partial<RemovedPresetMessages>[]): Promise<RemovedPresetMessages[]> {
        const newRemovedPms = this.removedPmsRepository.create([...pmsInfo]);
        return this.removedPmsRepository.save(newRemovedPms);
    }
}
