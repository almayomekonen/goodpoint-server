import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoginToDifferentSchoolDto {
    @IsNumber()
    @IsNotEmpty()
    schoolId: number;
}
