import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SchoolGrades } from '../enums';

export class AdminFetchClassesQuery {
    //this should be only SchoolGrades enum imo, but for some reason , the client sends 'null' as string
    //for the grade param
    @IsOptional()
    @IsString()
    grade: SchoolGrades | 'null';

    //comes as string , but later will be parsed to number
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cIndex: string;

    @IsOptional() //teacher name could be null
    @IsNotEmpty()
    @IsString()
    tName: string;

    @Transform(({ obj }) => {
        console.log(obj);
        return JSON.parse(obj.fetchedClasses);
    })
    @IsNumber({}, { each: true })
    fetchedClasses: string;
}
