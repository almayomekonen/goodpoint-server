import { Gender, PresetCategory, SchoolGrades } from '../enums';
import { getTranslations } from '../translations/getTranslations';
import { detectLang } from './detect-lang';

/**
 * receives a gender in some he/ar , and needs to translate it back to english
 */
export const translateGender = (gender: string): Gender => {
    const lang = detectLang(gender);
    const translations = getTranslations(lang);
    gender = gender.replace(/[^a-zA-Zא-ת\u0621-\u064A]/g, ''); //remove all extra characters
    return Object.keys(translations.genders).find((key) => translations.genders[key].includes(gender)) as Gender;
};

/**
 *
 * @param category - native category (like `"חברתי"`)
 * @returns The function returns the original English key of the category
 */
export const translatePresetCategory = (category: string): PresetCategory => {
    const lang = detectLang(category);
    const translations = getTranslations(lang);

    return Object.keys(translations.categories).find(
        (key) => translations.categories[key] === category,
    ) as PresetCategory;
};

/** @param target - the grade in hebrew or arabic
 * @returns the grade in english
 *
 */
export function translateGrade(target: string): SchoolGrades {
    const lang = detectLang(target);
    const translations = getTranslations(lang);

    return Object.keys(translations.grades).find((key) => translations.grades[key] === target) as SchoolGrades;
}
