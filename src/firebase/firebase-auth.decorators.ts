import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
});

export interface FirebaseUserType {
    id: string;
    email: string;
    username: string;
    roles: string[];
    roleKeys: string[];
    schoolId?: number;
    type: string;
    uid: string;
    [key: string]: any;
}

export type RequestUserType = FirebaseUserType;

export const extractTokenFromCookie = (cookieName: string, required: boolean = true) => {
    return (request: any): string | undefined => {
        const token = request.cookies?.[cookieName];
        if (required && !token) {
            throw new Error(`Token ${cookieName} not found in cookies`);
        }
        return token;
    };
};
