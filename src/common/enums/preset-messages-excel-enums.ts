import { Gender } from './gender.enum';
import { Language } from './language.enum';
import { PresetCategory } from './preset-category.enum';

const ExcelHebrewGender = {
    [Gender.MALE]: ['זכר', "ז'"],
    [Gender.FEMALE]: ['נקבה', "נ'"],
    [Gender.OTHER]: ['אחר'],
    [Gender.NONE]: ['אין'],
};

const ExcelHebrewPresetCategory = {
    [PresetCategory.social]: 'חברתי',
    [PresetCategory.educational]: 'לימודי',
    [PresetCategory.emotional]: 'רגשי',
    [PresetCategory.other]: 'אחר',
};

const ExcelArabicPresetCategory = {
    [PresetCategory.social]: 'חברתי',
    [PresetCategory.educational]: 'לימודי',
    [PresetCategory.emotional]: 'רגשי',
    [PresetCategory.other]: 'אחר',
};
//need to add arabic
export const presetMessagesExcelEnums = {
    presetCategory: {
        [Language.HEBREW]: ExcelHebrewPresetCategory,
        [Language.ARABIC]: ExcelArabicPresetCategory,
    },
    gender: {
        [Language.ARABIC]: ExcelHebrewGender,
        [Language.HEBREW]: ExcelHebrewGender,
    },
};
