import * as xlsx from 'xlsx';
import { Language } from '../enums';
import { translations } from 'src/common/translations/translationObjects';
import { NotFoundException } from '@nestjs/common';

/**
 * Creates an xlsx buffer from the provided data.
 *
 * @param {object[]} formattedData - The formatted data to be included in the xlsx buffer.
 * @param {Language} lang - The language used for translations.
 * @param {number[]} [columnsWidthArray] - An optional array specifying the width of each column in the xlsx file.
 * @returns {ArrayBuffer} The generated xlsx buffer.
 * @throws {NotFoundException} If the formattedData array is empty.
 * @throws {Error} If there is an error while creating the xlsx buffer.
 */
export function createXlsxBuffer(formattedData: object[], lang: Language, columnsWidthArray?: number[]): ArrayBuffer {
    try {
        if (!formattedData.length) throw new NotFoundException(`There is no data`);

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(formattedData);

        // style each of the columns
        ws['!cols'] = [];
        if (columnsWidthArray) {
            columnsWidthArray.forEach((width) => {
                ws['!cols'].push({ width });
            });
        } else {
            Object.keys(formattedData[0]).forEach(() => {
                ws['!cols'].push({ width: 30 });
            });
        }

        xlsx.utils.book_append_sheet(wb, ws, translations[lang].mails.gp);

        const buffer = xlsx.write(wb, {
            bookType: 'xlsx',
            type: 'buffer',
        });

        return buffer;
    } catch (error) {
        console.error('Error in create xlsx buffer:', error);
        throw error;
    }
}
