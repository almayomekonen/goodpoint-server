import { IsEmail } from 'class-validator';

export class AddEmailToSpamDto {
    @IsEmail()
    email: string;
}
