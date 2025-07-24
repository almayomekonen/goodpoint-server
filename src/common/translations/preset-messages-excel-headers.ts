import { Language } from '../enums';

export const presetMessagesExcelHeaders = {
    [Language.HEBREW]: {
        text: 'טקסט' as const,
        gender: 'מגדר',
        category: 'קטגוריה',
    },
    [Language.ARABIC]: {
        //need to fill with translations
        text: 'a',
        gender: 'b',
        category: 'c',
    },
};
