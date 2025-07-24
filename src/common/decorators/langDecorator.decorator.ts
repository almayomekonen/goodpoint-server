import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Language } from '../enums';

export const Lang = createParamDecorator((_data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest();
    if (request.cookies.lang) return request.cookies.lang;
    else return Language.HEBREW;
});
