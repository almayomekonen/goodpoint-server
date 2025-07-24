import * as XLSX from 'xlsx';
import { Language } from '../enums';
import { detectLang } from './detect-lang';

/**
 * Changing worksheet titles so that we don't have to rely on untranslated keys.
 * @param ws XLSX worksheet.
 * @param headers - object with all the translated headers.
 * @returns void - changes applies on worksheet.
 */
export function translateSheetHeaders(
    ws: XLSX.WorkSheet,
    headers: Record<Language, Record<string, string | string[]>>,
): void {
    if (!ws || !ws['!ref']) return;

    let lang: Language;
    const ref = XLSX.utils.decode_range(ws['!ref']);

    for (let i = ref.s.c; i <= ref.e.c; ++i) {
        //loop over headers only
        const cell: XLSX.CellObject | undefined = ws[XLSX.utils.encode_cell({ r: ref.s.r, c: i })];

        if (cell && cell.t === 's' && cell.w) {
            if (!lang) lang = detectLang(cell.w);

            for (const [headerKey, translated] of Object.entries(headers[lang])) {
                if (Array.isArray(translated)) {
                    for (const text of translated) {
                        if (cell.w.startsWith(text)) {
                            cell.w = headerKey;
                            break;
                        }
                    }
                } else if (cell.w.startsWith(translated)) {
                    cell.w = headerKey;
                    break;
                }
            }
        }
    }
}
