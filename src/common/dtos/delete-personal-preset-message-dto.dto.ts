import { IsNumber } from 'class-validator';

export class DeletePMDDTO {
    @IsNumber()
    pmId: number;
}
