import { MailDataRequired } from '@sendgrid/mail';

export type EmailData = (MailDataRequired | Omit<MailDataRequired, 'from'>) & {
    html: JSX.Element | string;
    from?: string;
};
