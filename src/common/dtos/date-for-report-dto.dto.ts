import { IsNotEmpty, IsString } from 'class-validator';
export class DateForReportDto {
    @IsString()
    @IsNotEmpty()
    from: string;

    @IsString()
    @IsNotEmpty()
    to: string;
}
