import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { DateForReportDto } from './date-for-report-dto.dto';

export class CreateClassReportDto {
    @IsNumber()
    @IsNotEmpty()
    classId: number;

    @ValidateNested()
    @Type(() => DateForReportDto)
    @IsNotEmpty()
    dates: DateForReportDto;
}
