import { SchoolGrades } from '../enums';

export type ClassesTableRow = {
    id: number;
    grade: SchoolGrades;
    classIndex: number;
    teacher: {
        firstName: true;
        lastName: true;
        id: true;
    };
};
