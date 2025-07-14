import { IsNumber } from 'class-validator';
import { CreateSchoolDto } from './create-school-dto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolDto extends CreateSchoolDto {
    @IsNumber()
    @ApiProperty()
    id: number;
}
