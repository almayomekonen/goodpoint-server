import { SMS_SENDER_NAME } from './sms-sender-name';

// todo - make sure why is this here(no one uses this)
export const twoFactorOptions = {
    SMSSender: SMS_SENDER_NAME,
    blocked: 3600,
    codeLength: 6,
    expires: 300,
    maxAttempts: 6,
    spamManagement: true,
};
