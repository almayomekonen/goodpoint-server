import { translations } from '../translations/translationObjects';

const Languages = Object.keys(translations);

export const allGendersTranslations = Languages.reduce((prev: string[], next: keyof typeof translations) => {
    for (const gender in translations[next].genders)
        if (Array.isArray(translations[next].genders[gender])) prev.push(...translations[next].genders[gender]);
        else prev.push(translations[next].genders[gender]);
    return prev;
}, []);

export const allGradesTranslations = Languages.reduce((prev: string[], next: keyof typeof translations) => {
    for (const grade in translations[next].grades) prev.push(translations[next].grades[grade]);
    return prev;
}, []);

export const allCategoriesTranslations = Languages.reduce((prev: string[], next: keyof typeof translations) => {
    for (const category in translations[next].categories) prev.push(translations[next].categories[category]);
    return prev;
}, []);
