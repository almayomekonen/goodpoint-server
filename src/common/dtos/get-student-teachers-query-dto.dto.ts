import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
    @Transform(({ value }) => Number(value))
    @ApiProperty({ type: Number })
    @IsNumber()
    pageNumber: number;

    @Transform(({ value }) => Number(value))
    @ApiProperty({ type: Number })
    @IsNumber()
    perPage: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ type: String, required: false })
    filterName: string;
}
