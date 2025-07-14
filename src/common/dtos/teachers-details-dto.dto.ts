import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Language } from '../enums';

export class TeacherDetailsDto {
    @IsString()
    @Length(2, 50)
    firstName: string;

    @IsString()
    @Length(2, 50)
    lastName: string;

    @Length(0, 10)
    @IsOptional()
    phoneNumber: string;

    @IsString()
    @IsEmail()
    username: string;

    @IsOptional()
    @IsBoolean()
    systemNotifications: boolean;

    @IsOptional()
    @IsEnum(Language)
    languagesToggle: Language;
}
