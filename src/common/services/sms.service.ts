import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
    private readonly logger = new Logger(SmsService.name);

    async sendBulkSMS(phones: string[], message: string, senderName?: string): Promise<void> {
        this.logger.log(`Sending SMS to ${phones.length} numbers with message: ${message}`);

        // In a real implementation, you would integrate with an SMS provider
        // For now, just log the SMS details
        phones.forEach((phone) => {
            this.logger.log(`SMS to ${phone}: ${message} (from: ${senderName || 'Default'})`);
        });

        // Simulate async SMS sending
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    async sendSMS(phone: string, message: string, senderName?: string): Promise<void> {
        return this.sendBulkSMS([phone], message, senderName);
    }
}
