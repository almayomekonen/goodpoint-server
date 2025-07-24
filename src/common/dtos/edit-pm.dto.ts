import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';
import { Gender, PresetCategory } from '../enums';
export class EditPmDto {
    @IsNumber()
    id: number;

    @IsString()
    @Matches(new RegExp('[a-zA-Z0-9א-ת \u0621-\u064A,-:"._!?s()]*', 'i'))
    text: string;

    @IsEnum(PresetCategory)
    presetCategory: PresetCategory;

    @Transform(({ value }) => value.toUpperCase())
    @IsEnum(Gender)
    gender: Gender;
}
