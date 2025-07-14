import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}
