import { Transform } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class CreateSuperAdminDto {
    @Transform(({ value }) => {
        console.log(value);
        value.replace(/[\u{0080}-\u{FFFF}]/gu, '');
    })
    @IsEmail()
    username: string;
    @IsString()
    password: string;
}
