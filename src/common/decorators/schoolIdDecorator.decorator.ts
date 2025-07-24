import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

//validates for a school id and returns it
export const SchoolId = createParamDecorator((_data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const schoolId = user?.schoolId;

    // Enhanced logging for debugging
    console.log('🏫 SchoolId decorator called:');
    console.log('  - Request URL:', request.url);
    console.log('  - Request method:', request.method);
    console.log('  - User exists:', !!user);
    console.log('  - User ID:', user?.id);
    console.log('  - User username:', user?.username);
    console.log('  - User type:', user?.type);
    console.log('  - User roles:', user?.roles);
    console.log('  - User schoolId:', schoolId);
    console.log('  - SchoolId type:', typeof schoolId);

    if (!user) {
        console.log('❌ SchoolId decorator - No user in request');
        throw new BadRequestException('Authentication required - no user found in request');
    }

    if (!schoolId) {
        console.log('❌ SchoolId decorator - schoolId is undefined/null');
        console.log('  - This usually means the user has no school associations in user_school table');
        console.log('  - Check that user has entries in user_school table with deletedAt = NULL');
        console.log('  - For debugging, call GET /api/staff/debug/auth-state');

        // For now, throw an error instead of returning null to make the issue visible
        throw new BadRequestException({
            message: 'User has no school association',
            details: 'This user is not associated with any school. Please contact administrator.',
            debugEndpoint: '/api/staff/debug/auth-state',
            userId: user.id,
            username: user.username,
        });
    }

    console.log('✅ SchoolId decorator - returning schoolId:', schoolId);
    return schoolId;
});
