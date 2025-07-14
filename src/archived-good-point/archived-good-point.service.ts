import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArchivedGoodPoint } from 'src/entities';
import { GoodPointService } from 'src/good-point/good-point.service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ArchivedGoodPointService {
    constructor(
        @InjectRepository(ArchivedGoodPoint)
        private readonly archivedRepository: Repository<ArchivedGoodPoint>,
        private readonly goodPointService: GoodPointService,
    ) {}

    getColumnNames(): Record<keyof ArchivedGoodPoint, string> {
        return this.archivedRepository.metadata.columns.reduce(
            (value, col) => {
                value[col.propertyName] = col.databaseName;
                return value;
            },
            {} as Record<keyof ArchivedGoodPoint, string>,
        );
    }

    async insertGoodPointsToArchive(manager: EntityManager) {
        const gpsColumns = this.goodPointService.getColumnNames();
        const archColumns = this.getColumnNames();

        let query = `INSERT INTO ${this.archivedRepository.metadata.tableName}`;
        query += `(${archColumns.id},${archColumns.created},${archColumns.dateSent},${archColumns.gpText},${archColumns.teacherId},${archColumns.studentId},${archColumns.viewCount})`;
        query += ` SELECT ${gpsColumns.id},NOW(),${gpsColumns.created},${gpsColumns.gpText},${gpsColumns.teacherId},${gpsColumns.studentId},${gpsColumns.viewCount}`;
        query += ` FROM good_points`;

        await manager.query(query);
    }
}
