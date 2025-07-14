import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';

//validates for a school id and returns it
export const SchoolId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const schoolId = request.user.schoolId;
    if (!schoolId) throw new ForbiddenException('no school id found');
    return schoolId;
});
