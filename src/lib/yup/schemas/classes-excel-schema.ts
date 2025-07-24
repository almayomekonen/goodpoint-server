import * as yup from 'yup';
import { GRADES_REGEX } from '../../../common/consts/regexes';
import { ClassesHeaders } from '../../../common/translations/translationObjects';
import { EMAIL_SCHEMA, NAME_SCHEMA } from './common-schemas';
import { allGradesTranslations } from '../../../common/consts/genders-translations';

export const ClassesExcelSchema = yup.object().shape({
    excelRows: yup.array().of(
        yup.object().shape<Record<ClassesHeaders, any>>(
            {
                firstName: yup.string().when('fullName', {
                    is: (fullName: string) => !fullName,
                    then: () => NAME_SCHEMA.notRequired(),
                }),
                lastName: yup.string().when('fullName', {
                    is: (fullName: string) => !fullName,
                    then: () => NAME_SCHEMA.notRequired(),
                }),
                fullName: yup.string().when(['firstName', 'lastName'], {
                    is: (firstName: string, lastName: string) => !firstName && !lastName,
                    then: () => NAME_SCHEMA.notRequired(),
                }),
                username: yup.string().when(['firstName', 'lastName', 'fullName'], {
                    is: (firstName: string, lastName: string, fullName: string) => !firstName && !lastName && !fullName,
                    then: () => EMAIL_SCHEMA.notRequired(),
                }),

                classNumber: yup.number().min(1).max(15),
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
            },
            [
                ['firstName', 'fullName'],
                ['lastName', 'fullName'],
            ],
        ),
    ),
});
