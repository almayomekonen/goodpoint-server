import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DateForReportDto } from './date-for-report-dto.dto';

export class CreateStudentsReportDto {
    @IsOptional()
    @IsString()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    classId: number;

    @IsArray()
    studentsIds: number[];

    @ValidateNested()
    @Type(() => DateForReportDto)
    @IsNotEmpty()
    dates: DateForReportDto;

    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    allStudents: boolean;
}
