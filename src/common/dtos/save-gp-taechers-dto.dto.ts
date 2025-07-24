import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SaveGpTeachersDto {
    @IsString()
    @IsNotEmpty()
    receiverId: string;

    @IsString()
    @IsNotEmpty()
    @Length(0, 1024)
    gpText: string;
}
