import { BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as yup from 'yup';
import { ClassesExcelSchema, PmExcelSchema, StudentExcelSchema, TeachersExcelSchema } from '../../lib/yup/schemas';
import { Language } from '../enums';
import { detectLang } from '../functions/detect-lang';
import { translateSheetHeaders } from '../functions/translate-sheet-headers.function';
import { ExcelPipeResult, ExcelSheet } from '../pipes/excel-validator.pipe';
import { translations } from '../translations/translationObjects';

/**
 * If you want to add new excel schema (and upload function) you should:
 *  1. Add new type to `EXCEL_TYPES`, and give it a name that represents its meaning.
 *  2. Add headers to `translations` (under `translationObjects.ts`).
 *      - The headers must be set in the following format:
 *      - `${EXCEL_TYPES.yourType}Headers`
 *      - It's best to define new type that is `keyof typeof translations['he']['yourHeaders']` next to the other types and use it.
 *  3. Add matching schema to ValidationSchemas object below.
 */
export enum EXCEL_TYPES {
    students = 'students',
    classes = 'classes',
    presetMessages = 'presetMessages',
    teachers = 'teachers',
}

const ValidationSchemas: Record<EXCEL_TYPES, yup.AnySchema> = {
    students: StudentExcelSchema,
    classes: ClassesExcelSchema, //TODO fix schema headers.
    presetMessages: PmExcelSchema,
    teachers: TeachersExcelSchema,
};

/**
 * Generic function that prase and validates uploaded excels before passing them to processing funcs.
 *
 * @param file - Uploaded excel file
 * @param type - Determines what excel schema and headers to use.
 * @returns Sheet as array of `Partial<Record<T,string>>`, when T is type headers.
 * @throws {BadRequestException} If the Excel file is empty or invalid.
 *   - If the file is empty, a BadRequestException with the message "empty excel file" is thrown.
 *   - If the file is invalid, a BadRequestException with the message "invalid excel table" is thrown.
 *   - If there are Yup validation errors, a BadRequestException with the message "Invalid Excel Table" and the errors is thrown.
 *
 */
export async function yupExcelValidator<T extends string>(
    file: Express.Multer.File,
    type: EXCEL_TYPES,
): Promise<ExcelPipeResult<T>> {
    try {
        const workbook = XLSX.read(file.buffer);

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const validHeaders: Record<Language, Record<string, string | string[]>> = {
            ar: translations['ar'][type + 'Headers'],
            he: translations['he'][type + 'Headers'],
        };

        translateSheetHeaders(sheet, validHeaders);

        const worksheet = XLSX.utils.sheet_to_json(sheet, { skipHidden: true });

        if (worksheet.length === 0) throw new BadRequestException('empty excel file');

        const excelRowSchema = ValidationSchemas[type];

        const isValid = await excelRowSchema.validateSync({ excelRows: worksheet }, { abortEarly: false });

        if (!isValid) throw new BadRequestException('invalid excel table');

        return {
            sheet: worksheet as ExcelSheet<T>,
            headerLang: detectLang(Object.keys(worksheet[0])[0]),
        };
    } catch (yupError) {
        throw new BadRequestException({
            message: `Invalid Excel Table`,
            errors: yupError.errors ?? yupError,
        });
    }
}
