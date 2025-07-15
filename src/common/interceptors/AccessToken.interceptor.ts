import { extractTokenFromCookie } from '@hilma/auth-nest';
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessTokenService } from 'src/access-token/access-token.service';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AccessTokenInterceptor.name);

    constructor(
        // private readonly accessTokenService: AccessTokenService;
        @Inject(AccessTokenService) private accessTokenService: AccessTokenService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        // Skip token validation for login route
        if (request.path === '/api/staff/login') {
            return next.handle();
        }

        const accessTokenFetcher = extractTokenFromCookie(process.env.ACCESS_TOKEN_NAME, false);

        const accessToken: string = accessTokenFetcher(request);

        if (accessToken) {
            // Access the AccessTokenService methods or properties here
            const valid = await this.accessTokenService.validateAccessToken(accessToken);
            if (!valid) {
                this.logger.log('error- access token is not valid');
                throw new UnauthorizedException('Invalid access token');
            }
        }

        return next.handle();
    }
}
