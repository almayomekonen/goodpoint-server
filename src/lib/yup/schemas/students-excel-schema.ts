import * as yup from 'yup';
import { allGradesTranslations } from '../../../common/consts/genders-translations';
import { GRADES_REGEX } from '../../../common/consts/regexes';
import { StudentHeaders } from '../../../common/translations/translationObjects';
import { GENDER_SCHEMA, NAME_SCHEMA, PHONE_SCHEMA } from './common-schemas';

export const StudentExcelSchema = yup.object().shape({
    excelRows: yup.array().of(
        yup.object().shape<Record<StudentHeaders, any>>(
            {
                firstName: yup.string().when('fullName', {
                    is: (fullName: string) => !fullName,
                    then: () => NAME_SCHEMA,
                }),
                lastName: yup.string().when('fullName', {
                    is: (fullName: string) => !fullName,
                    then: () => NAME_SCHEMA,
                }),
                fullName: yup.string().when(['firstName', 'lastName'], {
                    is: (firstName: string, lastName: string) => !firstName && !lastName,
                    then: () => NAME_SCHEMA,
                }),

                classNumber: yup.mixed().optional(),

                grade: yup
                    .string()
                    .test(
                        'class-number-match',
                        ({ path }) => path + ' class-grade-error',
                        function (grade: string) {
                            const classIndex = Number(grade.match(/\d+/)?.join('')) || this.parent['classNumber'];

                            grade = grade.match(GRADES_REGEX)?.join('');

                            if (!grade) return false;
                            if (!allGradesTranslations.includes(grade)) return false;
                            if (!classIndex || classIndex > 15) return false;

                            return true;
                        },
                    )
                    .required(),

                //todo Say At least one phone number is required.
                phone_p1: yup.string().when('phone_p2', {
                    is: (phone_p2: string) => !phone_p2,
                    then: () => PHONE_SCHEMA,
                }),

                phone_p2: yup.string().when('phone_p1', {
                    is: (phone_p1: string) => !phone_p1,
                    then: () => PHONE_SCHEMA,
                }),

                studentPhone: PHONE_SCHEMA.optional(),

                gender: GENDER_SCHEMA,
            },
            [
                ['lastName', 'fullName'],
                ['firstName', 'fullName'],
                ['phone_p1', 'phone_p2'],
            ],
        ),
    ),
});
