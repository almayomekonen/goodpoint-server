import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTeacherDto {
    @IsString()
    @IsNotEmpty()
    teacherId: string;
}
