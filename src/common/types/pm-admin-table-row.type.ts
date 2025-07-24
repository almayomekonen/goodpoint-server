import { Gender, PresetCategory } from '../enums';

export type PMAdminTableRow = {
    id: number;
    created: string;
    gender: Gender;
    lang: string;
    presetCategory: PresetCategory;
    schoolId: number;
    text: string;
    creatorId: string;
};
