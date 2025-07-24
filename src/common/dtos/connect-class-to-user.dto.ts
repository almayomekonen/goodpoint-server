import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConnectClassToUserDto {
    @IsNumber()
    @IsNotEmpty()
    classId: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum({ remove: 'remove', add: 'add' })
    action: 'remove' | 'add';
}
