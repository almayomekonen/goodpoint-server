import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { Gender, SchoolGrades } from '../enums';
export class SaveStudentDto {
    @IsNumber()
    @IsOptional()
    id: number;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEnum(SchoolGrades)
    grade?: string | number;

    // @IsNumberString()
    @Type(() => Number)
    classIndex?: string;

    @IsEnum(Gender)
    gender?: Gender;

    @IsString()
    @IsOptional()
    @ValidateIf((e) => e.phoneNumber !== '')
    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    phoneNumber?: string; // optional

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ParentPhoneDto)
    relativesPhoneNumbers: ParentPhoneDto[];
}

class ParentPhoneDto {
    @IsString()
    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    phone: string;
}
