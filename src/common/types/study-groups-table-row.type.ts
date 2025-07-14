import { SchoolGrades } from '../enums';

export type StudyGroupsRow = {
    id: number;
    grades: SchoolGrades[];
    name: string;
    teacher?: {
        firstName: true;
        lastName: true;
        id: true;
    };
};
