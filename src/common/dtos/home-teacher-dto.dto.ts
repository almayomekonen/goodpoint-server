import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { FIRST_LAST_NAME_REGEX } from '../consts/regexes';
import { AdminAddOrEditClassFormDto } from './admin-add-or-edit-class-form-dto.dto';

export class HomeTeacherDto extends AdminAddOrEditClassFormDto {
    @Matches(new RegExp(FIRST_LAST_NAME_REGEX, 'i'))
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Matches(new RegExp(FIRST_LAST_NAME_REGEX, 'i'))
    @IsString()
    @IsNotEmpty()
    lastName: string;
}
