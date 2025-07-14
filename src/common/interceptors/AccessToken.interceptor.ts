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

/**
 * Intercepts incoming requests and validates the jwt token from the access token tables.
 * @returns a interceptor guard
 */
@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AccessTokenInterceptor.name);

    constructor(
        // private readonly accessTokenService: AccessTokenService;
        @Inject(AccessTokenService) private accessTokenService: AccessTokenService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

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
