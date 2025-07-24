import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { HybridAuthGuard } from './hybrid-auth.guard';
import { ROLES_KEY, HYBRID_AUTH_KEY } from './firebase-auth.guard';
import { Roles } from 'src/common/enums/roles.enum';

export const UseHybridAuth = (...roles: Roles[]) => {
    return applyDecorators(
        SetMetadata(HYBRID_AUTH_KEY, true),
        SetMetadata(ROLES_KEY, roles),
        UseGuards(HybridAuthGuard),
    );
};
