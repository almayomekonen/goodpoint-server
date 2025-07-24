import { IsNotEmpty, IsNumberString } from 'class-validator';

export class StudentByClassParams {
    @IsNumberString()
    @IsNotEmpty()
    grade: string;

    @IsNumberString()
    @IsNotEmpty()
    classIndex: string;
}
