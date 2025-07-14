import { Gender, SchoolGrades } from '../enums';

export interface TeacherRow {
    id: number;
    firstName: string;
    lastName: string;
    gender: Gender;
    classId: number;
    email: string;
    classes: Omit<ClassList, 'id'>[];
}

export type ClassList = { id: number; grade: SchoolGrades; classIndex: number };
