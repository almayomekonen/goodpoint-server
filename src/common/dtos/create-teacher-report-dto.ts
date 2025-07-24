import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DateForReportDto } from './date-for-report-dto.dto';

export class CreateTeacherReportDto {
    @IsString()
    @IsNotEmpty()
    teacherId: string;

    @ValidateNested()
    @Type(() => DateForReportDto)
    @IsNotEmpty()
    dates: DateForReportDto;
}
