import { RequestUserType } from '@hilma/auth-nest';

export interface CustomRequestUserType extends RequestUserType {
    schoolId?: number;
}
