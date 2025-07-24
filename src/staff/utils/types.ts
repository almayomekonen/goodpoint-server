import { RequestUserType } from 'src/firebase/firebase-auth.decorators';

export interface CustomRequestUserType extends RequestUserType {
    schoolId?: number;
}
