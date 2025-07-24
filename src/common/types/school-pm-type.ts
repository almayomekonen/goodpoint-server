import { Gender, Language, PresetCategory } from '../enums';

export type SchoolPMType = {
    id: number;
    text: string;
    presetCategory: PresetCategory;
    gender: Gender;
    lang: Language;
    schoolId: number;
    countpresetMessageId: string;
};
