import { SpamManagerService } from '@hilma/auth-nest';
import { Injectable, Logger } from '@nestjs/common';
import { ClientResponse } from '@sendgrid/client/src/response';
import * as sgMail from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';
import { EmailData } from './mail-data.type';
import { render } from '@react-email/render';
import { ReactElement } from 'react';
import { Language } from 'src/common/enums';
import CreateEmail from 'src/lib/react-email/components/CreateEmail';
import { TFunction } from 'src/common/types/function.type';

@Injectable()
export class MailService {
    private transporter: any;
    private readonly url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.SERVER_DOMAIN;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly spamManagerService: SpamManagerService) {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async sendEmail(data: EmailData, checkIfSpam = false): Promise<[ClientResponse, object]> {
        if (checkIfSpam) {
            const spamBlockedEmails = await this.spamManagerService.emailInSpam(data.to as string);
            if (spamBlockedEmails) throw 'This email is spam blocked';
        }

        const newData: sgMail.MailDataRequired = {
            ...data,
            from: data.from,
            subject: data.subject,
        };

        return this.transporter.sendMail(newData);
    }

    /**
     * @param data fields:
     * --------------
     * @param {string} from- title in the mail
     * @param {string} to- addressee email address
     * @param {string} html- Email structure and content
     * @param {string?} text
     * @param {string} subject
     * @param {Array<any>?} attachments- any files you wish to send
     * -------------
     * @param {Function}  cb - callback, NOT IN USE JUST PASS NULL
     * @param {boolean} isSpam- use spam manager to handle spam.
     */
    async send(
        data: {
            from: string;
            to: string | Array<string>;
            html: string;
            text?: string;
            subject: string;
            attachments?: Array<any>;
        },

        // eslint-disable-next-line
        cb: TFunction = null,
        isSpam = false,
    ) {
        // cb is here because auth requires (not in use).

        if (process.env.SEND_EMAIL !== 'true') {
            this.logger.log(`SKIPPING mail to ${data.to}, titled with ${data.subject}`);
            return [{ statusCode: 200 }, { message: 'DEVELOPMENT SKIP' }] as unknown as [ClientResponse, object];
        }

        if (!data.attachments) data.attachments = [];

        // icon name in the client must match the name in here!!
        data.attachments.push({
            path: `${this.url}/logo-text.png`,
            cid: `${this.url}/logo-text.png`, //same cid value as in the html img src
        });

        return this.sendEmail({ ...data, from: data.from || process.env.MAIL_USER } as unknown as EmailData, isSpam);
    }

    /**
     * @method create massage in uniform format
     * @param {Array<string> | string} content- each index in the array will create a new line with its content | You can also pass HTML string.
     * @param {string} headline
     * @param {boolean} isSpam Add spam removal link in the bottom of this email.
     * @returns {string} html string for email content
     */
    createHtmlMessage(content: ReactElement | string[] | string, headline: string, emailForSpam = '', lang: Language) {
        return render(CreateEmail({ content, headline, emailForSpam, imageDomain: this.url, lang }));
    }
}
