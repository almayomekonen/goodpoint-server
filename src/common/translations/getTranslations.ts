import { Language } from '../enums';
import { translations } from './translationObjects';

// const langs = ['he', 'ar']
export function getTranslations(lang: Language) {
    return translations[lang];
}
