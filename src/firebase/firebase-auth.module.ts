import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseAuthService } from './firebase-auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { HybridAuthGuard } from './hybrid-auth.guard';
import { UserLinkingService } from './user-linking.service';
import { FirebaseAuthController } from './firebase-auth.controller';
import { User } from '../entities/user.entity';
import { Staff } from '../entities/staff.entity';
import { Student } from '../entities/student.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Staff, Student]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') || 'fallback-secret',
                signOptions: {
                    expiresIn: configService.get('authentication.tokenExpiration') || '24h',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [FirebaseAuthController],
    providers: [
        FirebaseAuthService,
        FirebaseAuthGuard,
        HybridAuthGuard,
        UserLinkingService,
        // Temporarily disabled global guard for testing
        // {
        //     provide: APP_GUARD,
        //     useClass: FirebaseAuthGuard,
        // },
    ],
    exports: [FirebaseAuthService, HybridAuthGuard, UserLinkingService, TypeOrmModule],
})
export class FirebaseAuthModule {}
