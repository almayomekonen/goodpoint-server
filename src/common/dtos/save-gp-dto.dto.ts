import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class SaveGpDto {
    @IsNumber()
    @IsNotEmpty()
    studentId: number;

    @IsString()
    @IsNotEmpty()
    @Length(0, 1024)
    gpText: string;

    @IsOptional()
    @IsNumber()
    openSentenceId?: number;
}
