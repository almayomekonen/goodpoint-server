import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional, IsString, ValidateNested, isEnum } from 'class-validator';
import { StudyGroupGrades } from 'src/entities/study-groups-grades.entity';
import { SchoolGrades } from '../enums';

class StudyGroupGradeDto {
    @IsNumberString()
    @Transform(({ value }) => {
        if (isEnum(value, SchoolGrades)) {
            return value;
        } else {
            throw new BadRequestException('The grade number must be less than 12 and greater than 1');
        }
    })
    grade: string;
}
export class AdminAddOrEditStudyGroupDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    teacherId?: string;

    @IsString()
    name: string;

    @ValidateNested({ each: true })
    @Type(() => StudyGroupGradeDto)
    studyGroupGrades: StudyGroupGrades[];
}
