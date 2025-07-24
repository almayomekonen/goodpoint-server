import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Gender, SchoolGrades } from '../enums';

export class SaveTeacherDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsEmail()
    username: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ClassesDto)
    classes?: ClassesDto[];
}

class ClassesDto {
    @IsEnum(SchoolGrades)
    grade: SchoolGrades;

    @IsNumber()
    @Min(1)
    @Max(15)
    classIndex: number;
}
