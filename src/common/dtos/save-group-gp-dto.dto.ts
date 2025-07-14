import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class SaveGroupGpDto {
    @IsNotEmpty()
    @IsArray()
    studentIds: number[];

    @IsString()
    @IsNotEmpty()
    @Length(0, 1024)
    gpText: string;
}
