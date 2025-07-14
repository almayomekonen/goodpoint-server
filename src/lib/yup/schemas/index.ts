import { localeConfig, methodConfig } from '../yup-config';

methodConfig();
localeConfig();
export * from '../yup-config';
export * from './classes-excel-schema';
export * from './pm-excel-schema';
export * from './students-excel-schema';
export * from './teachers-excel-schema';
export * from '../../../common/validators/yup-excel-validator';
