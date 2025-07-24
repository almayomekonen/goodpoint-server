import { Language } from '../enums';

export const studentsExcelHeaders = {
    [Language.HEBREW]: {
        first_name: 'שם פרטי',
        last_name: 'שם משפחה',
        gender: 'מגדר',
        parent_phone: 'טלפון הורה',
        student_phone: 'טלפון תלמיד',
        class_number: 'מספר כיתה',
        grade: 'שכבה',
        sex: 'מין',
    },
    [Language.ARABIC]: {
        first_name: 'الاخط' as ' الاخط',
        last_name: ' ما اسْمُكَ الأَخيرُ؟',
        gender: 'النوج',
        grade: ' الجذور',
        class_number: 'الفئة',
        parent_phone: 'الهاء',
        student_phone: ' الهاء الطلي',

        sex: 'الجنس',
    },
};
