import { IsOptional, IsString } from 'class-validator';

export class FilterSettings<T> {
    columnKey: keyof T;

    @IsOptional()
    optionKey?: string | string[];

    @IsString()
    dropDownKey: string;

    filter: ((value: T[keyof T]) => boolean) | ((value: T[keyof T]) => boolean)[];
}
