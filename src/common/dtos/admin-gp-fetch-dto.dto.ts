import { IsArray, IsString } from 'class-validator';

export class AdminGPsFetchDTO {
    @IsArray()
    @IsString({ each: true })
    gpIds: string[] | null;
}
