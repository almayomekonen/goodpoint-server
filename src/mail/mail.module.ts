import { SpamManagerService } from 'src/common/services/spam-manager.service';
import { Module } from '@nestjs/common';

import { MailService } from './mail.service';

@Module({
    imports: [],
    exports: [MailService],
    providers: [MailService, SpamManagerService],
})
export class MailModule {}
