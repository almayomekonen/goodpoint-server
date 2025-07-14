import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
    // @Transform(({ value }) => {
    //   console.log(value);
    //   value.replace(/[\u{0080}-\u{FFFF}]/gu, "")
    // })
    @IsEmail()
    username: string;

    @IsString()
    password: string;

    @IsNumber()
    schoolId: number;
}
