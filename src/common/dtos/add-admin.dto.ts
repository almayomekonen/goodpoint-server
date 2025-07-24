import { IsEmail, IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { Gender } from '../enums';

export class AddAdminDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsNumber()
    schoolId: number;
}
