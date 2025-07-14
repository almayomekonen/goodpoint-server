import { IsArray, IsBoolean, IsString } from 'class-validator';

export class DeleteGoodPointsDto {
    @IsBoolean()
    all: boolean;

    @IsArray()
    @IsString({ each: true })
    selected: string[];

    @IsString()
    studentId: string;
}
