import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationAdminTableDto {
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @ApiProperty({ type: Number })
    pageNumber: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @ApiProperty({ type: Number })
    perPage: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, required: false })
    q: string;

    @IsArray()
    @IsOptional()
    @ApiProperty({ type: String, required: false })
    grade?: string[];
}
