import { Language } from '../enums';
import { langRegex } from '../regexes/langRegEx';

/**
 * @param string the string to detect the language of
 * @returns  the language of the string
 */
export const detectLang = (string: string): Language => {
    try {
        for (const lang in Language) {
            if (string.match(langRegex[Language[lang]])) return Language[lang];
        }
        return Language.HEBREW;
    } catch (err) {
        console.error('ERR on deteact lang:', err);
        return Language.HEBREW;
    }
};
