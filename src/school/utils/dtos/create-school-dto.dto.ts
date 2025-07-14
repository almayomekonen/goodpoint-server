import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, Matches } from 'class-validator';

export class CreateSchoolDto {
    @IsNumberString()
    @ApiProperty({ type: String })
    @Matches(/^[0-9]{6}$/)
    code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ type: String })
    @Matches(/^[א-ת 0-9 "']{0,30}$/)
    name: string;
}
