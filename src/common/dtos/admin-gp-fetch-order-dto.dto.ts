import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { AdminGPsFetchEnum } from '../enums/admin-gps-fetch-order';

export class AdminGpsFetchQueryDto {
    @IsEnum(AdminGPsFetchEnum)
    order: AdminGPsFetchEnum;

    @Transform(({ obj }) => {
        return JSON.parse(obj.gpIds);
    })
    @IsNumber({}, { each: true })
    gpIds: string;
}
