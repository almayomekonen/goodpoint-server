import * as yup from 'yup';
import { FIRST_LAST_NAME_REGEX } from '../../../common/consts/regexes';
import { allCategoriesTranslations, allGendersTranslations } from '../../../common/consts/genders-translations';

export const NAME_SCHEMA = yup
    .string()
    .trim()
    .matches(new RegExp(FIRST_LAST_NAME_REGEX, 'i'), ({ path }) => path + ' invalid-text')
    .required();
export const PHONE_SCHEMA = yup
    .string()
    .phone('(!|0)5#-###-####', { startCodes: ['972'] }, ({ path }) => path + ' invalid-phone')
    .required();
export const GENDER_SCHEMA = yup
    .string()
    .trim()
    .matches(new RegExp(`^(${allGendersTranslations.join('|')})`), ({ path }) => path + ' invalid-gender');
export const PM_CATEGORIES_SCHEMA = yup
    .string()
    .matches(new RegExp(`^(${allCategoriesTranslations.join('|')})`), ({ path }) => path + ' invalid-pm-category');
export const EMAIL_SCHEMA = yup
    .string()
    .trim()
    .email(({ path }) => path + ' invalid-email')
    .required();
