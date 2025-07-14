import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodPointsPreset } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class GoodPointsPresetService {
    constructor(@InjectRepository(GoodPointsPreset) private gpPresetRepository: Repository<GoodPointsPreset>) {}

    async deleteGPPByPMID(pmId: number) {
        this.gpPresetRepository.delete({ presetMessageId: pmId });
    }

    async saveGP_PM(goodpointId: number, presetMessageId: number, schoolId: number) {
        return await this.gpPresetRepository.save({
            goodpointId,
            presetMessageId,
            schoolId,
        });
    }
}
