import { IsOptional, IsString, Matches } from 'class-validator';
import { Gender } from '../enums';

export class StudentDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    ageGroup: string;

    @IsString()
    classId?: number;

    @IsString()
    gender?: Gender;

    @IsString()
    @IsOptional()
    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    phoneNumber1?: string; // optional

    @IsString()
    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    phoneNumber2: string;

    @IsString()
    @IsOptional()
    @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    phoneNumber3?: string; // optional
}
