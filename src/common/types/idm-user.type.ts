import { Gender } from '../enums';

export type IdmUser = {
    zehut: string;
    schoolCodes: string[];
    firstName: string;
    lastName: string;
    gender: Gender;
};
