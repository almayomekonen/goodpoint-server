import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { SchoolGrades } from '../enums';

export class AdminAddOrEditClassFormDto {
    @IsEnum(SchoolGrades)
    grade: SchoolGrades;

    //classIndex comes as a string
    @Transform(({ value }) => {
        return Number(value);
    })
    @IsNumber()
    @Max(15)
    @Min(1)
    classIndex: number;

    @IsString()
    @IsOptional()
    teacherId?: string;

    @IsOptional()
    @IsNumber()
    id?: number;
}
