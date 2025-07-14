import { IsNumber, IsString } from 'class-validator';
import { AdminTableDto } from './admin-table.dto';
import { StudentRow } from '../types/student-row.type';

export class MoveStudentsDto extends AdminTableDto<StudentRow> {
    @IsString()
    grade: string;

    @IsNumber()
    classIndex: number;
}
