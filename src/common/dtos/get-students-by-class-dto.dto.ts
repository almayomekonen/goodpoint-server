import { IsNotEmpty, IsNumberString } from 'class-validator';
import { SchoolGrades } from '../enums';

export class StudentByClassParams {
    @IsNumberString()
    @IsNotEmpty()
    classIndex: number;

    @IsNumberString()
    @IsNotEmpty()
    grade: SchoolGrades;
}
