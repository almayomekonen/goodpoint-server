import * as yup from 'yup';
import { allGradesTranslations } from '../../../common/consts/genders-translations';
import { GRADES_REGEX } from '../../../common/consts/regexes';
import { TeachersHeaders } from '../../../common/translations/translationObjects';
import { GENDER_SCHEMA, NAME_SCHEMA, EMAIL_SCHEMA, PHONE_SCHEMA } from './common-schemas';
// sets translations schema

export const TeachersExcelSchema = yup.object().shape({
    excelRows: yup.array().of(
        yup.object().shape<Record<TeachersHeaders, any>>(
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
                        ({ path }) => path + ' Class number must be included in the grade',
                        function (grade: string) {
                            if (!grade) {
                                return true; // Allow empty grade since it's optional
                            }
                            const classIndex = Number(grade.match(/\d+/)?.join()) || this.parent['classNumber'];

                            //TODO add arabic grades
                            grade = grade.match(GRADES_REGEX)?.join();

                            if (!grade) return false;
                            if (!allGradesTranslations.includes(grade)) return false;
                            if (!classIndex || classIndex > 15) return false;

                            return true;
                        },
                    )
                    .optional(),

                gender: GENDER_SCHEMA,

                username: EMAIL_SCHEMA,

                phone: yup.string().concat(PHONE_SCHEMA),
            },
            [
                ['lastName', 'fullName'],
                ['firstName', 'fullName'],
            ],
        ),
    ),
});
