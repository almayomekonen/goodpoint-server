import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SpamManagerService {
    private readonly logger = new Logger(SpamManagerService.name);

    // Simple in-memory storage for spam emails/sms (can be replaced with database)
    private spamEmails = new Set<string>();
    private spamSms = new Set<string>();

    async addEmailSpam(email: string): Promise<void> {
        this.logger.log(`Adding email to spam: ${email}`);
        this.spamEmails.add(email);
    }

    async addSmsSpam(sms: string): Promise<void> {
        this.logger.log(`Adding SMS to spam: ${sms}`);
        this.spamSms.add(sms);
    }

    async emailInSpam(email: string): Promise<boolean> {
        return this.spamEmails.has(email);
    }

    async smsInSpam(sms: string): Promise<boolean> {
        return this.spamSms.has(sms);
    }

    removeHttp(domain: string): string {
        // Remove http/https from domain
        return domain.replace(/https?:\/\//, '');
    }
}
