import { Global, Module } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from 'src/entities';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AccessToken])],
    providers: [AccessTokenService],
    exports: [AccessTokenService],
})
export class AccessTokenModule {}
