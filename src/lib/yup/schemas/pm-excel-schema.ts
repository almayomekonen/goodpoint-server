import * as yup from 'yup';
import { GENDER_SCHEMA, PM_CATEGORIES_SCHEMA } from './common-schemas';
import { PM_HEADERS } from '../../../common/translations/translationObjects';

export const PmExcelSchema = yup.object().shape({
    excelRows: yup.array().of(
        yup.object().shape<Record<PM_HEADERS, any>>({
            text: yup.string().matches(new RegExp('[a-zA-Z0-9א-ת \u0621-\u064A,-:"._!?s()]*', 'i')).required(),
            category: PM_CATEGORIES_SCHEMA,
            gender: GENDER_SCHEMA,
        }),
    ),
});
