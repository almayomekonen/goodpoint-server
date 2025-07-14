import { SpamManagerService } from '@hilma/auth-nest';
import { deShuffle } from './common/functions/shuffle.functions';
import { AddEmailToSpamDto } from '@hilma/auth-nest/dist/spam-manager/dtos/add-email-to-spam.dto';
import { Controller, Get, Logger, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('app')
@Controller('/api')
export class AppController {
    private readonly logger = new Logger(AppController.name);

    constructor(private readonly spamManager: SpamManagerService) {}

    /**
     * Crucial for the production server to be able to rebuild after a successful pipeline
     */
    @Get('/health')
    getHello(): string {
        return 'OK';
    }

    @Get('/redirect')
    yo(@Res() res: Response) {
        res.redirect('https://google.com');
        return 'yo';
    }

    @Get('/add-email-to-spam')
    async addEmailToSpam(@Query() query: AddEmailToSpamDto, @Res() res: Response) {
        this.logger.log('Add email to spam:', query.email);
        try {
            this.spamManager.addEmailSpam(query.email);
        } catch (err) {
            this.logger.error(err);
        }
        return res.redirect('/unsubscribe-success/email');
    }

    @Get('/spam')
    async addSmsToSpam(@Query() query: { s: string }, @Res() res: Response) {
        this.logger.log('Add sms to spam:', query.s);
        try {
            this.spamManager.addSmsSpam(deShuffle(query.s));
        } catch (err) {
            this.logger.error(err);
        }
        return res.redirect('/unsubscribe-success/sms');
    }

    @Get('/excel-file-example/:fileName')
    async getExcelFileExample(@Res() res: Response, @Param('fileName') fileName: string) {
        const pathToFile = path.join(__dirname, `../public/excel-files/${fileName}`);
        const file = fs.readFileSync(pathToFile);
        const buffer = Buffer.from(file);
        res.set('Content-type', 'octet/stream');
        res.send(buffer);
    }
}
