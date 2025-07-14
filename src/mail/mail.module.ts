import { SpamManagerModule } from '@hilma/auth-nest';
import { Module } from '@nestjs/common';

import { MailService } from './mail.service';

@Module({
    imports: [SpamManagerModule],
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {}
