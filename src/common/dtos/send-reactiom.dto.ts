import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Emojis } from '../enums/emojis-enum.enum';

export class AddTeacherReactionDto {
    @IsNumber()
    gpId: number;

    @IsEnum(Emojis)
    reaction: Emojis;
}
export class SendReactionDto extends AddTeacherReactionDto {
    @IsString()
    sender: string;
}
