import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ActionParams } from './action-params-dto';

export class AdminTableDto<T> {
    @IsArray()
    @IsString({ each: true })
    selected: string[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => ActionParams<T>)
    params: ActionParams<T>;
}
