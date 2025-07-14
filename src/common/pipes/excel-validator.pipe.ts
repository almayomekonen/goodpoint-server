import { Injectable, PipeTransform } from '@nestjs/common';
import { EXCEL_TYPES, yupExcelValidator } from '../../lib/yup/schemas';
import { Language } from '../enums';

export type ExcelSheet<T extends string> = Partial<Record<T, string>>[];

export type ExcelPipeResult<T extends string> = {
    sheet: ExcelSheet<T>;
    headerLang: Language;
};

/**
 * transform pipe and validations pipe for excel files.
 * @export
 * @class ExcelValidatorPipe
 * @implements {PipeTransform}
 */
@Injectable()
export class ExcelValidatorPipe<T extends string>
    implements PipeTransform<Express.Multer.File, Promise<ExcelPipeResult<T>>>
{
    constructor(private type: EXCEL_TYPES) {}

    async transform(value: Express.Multer.File): Promise<ExcelPipeResult<T>> {
        const validated = await yupExcelValidator<T>(value, this.type);
        return validated;
    }
}
