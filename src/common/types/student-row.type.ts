import { Gender, SchoolGrades } from '../enums';

export type StudentRow = {
    id: number;
    firstName: string;
    lastName: string;
    gender: Gender;
    classId: number;
    phoneNumber: string;
    relativesPhoneNumbers: { phone: string }[];
    schoolId: number;
    class: ClassRoom;
};

export type ClassRoom = {
    grade: SchoolGrades;
    classIndex: number;
};
