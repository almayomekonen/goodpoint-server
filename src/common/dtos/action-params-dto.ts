import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FilterSettings } from './filter-settings-dto';

export class ActionParams<T> {
    @IsBoolean()
    allChecked: boolean;

    @IsOptional()
    @IsString()
    userSearch?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilterSettings<T>)
    filters: FilterSettings<T>[];
}
