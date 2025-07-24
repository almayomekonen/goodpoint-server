import { Controller } from '@nestjs/common';
import { IdmService } from './idm.service';
// import { Request, Response } from 'express';

@Controller('/api/idm')
export class IdmController {
    constructor(private idmService: IdmService) {}

    // @Get('initialize')
    // initializeIdmUser(@Res() res: Response /*@Req() req: Request*/) {
    //     // res.setHeader("Access-Control-Allow-Credentials", "true")
    //     // res.header("Access-Control-Allow-Origin", process.env.CLIENT_DOMAIN);
    //     // res.header('Access-Control-Allow-Credentials', "true");
    //     //move to idm login and if authorized , move on
    //     res.redirect(process.env.SERVER_DOMAIN + '/api/idm/login');
    //
    //     //TODO: once we have a client id and secret we activate this
    //     // const authorizationUrl = this.idmService.client.authorizationUrl({
    //     //     scope: 'openid profile eduorg edustudent',
    //     // });
    //     // res.redirect(authorizationUrl);
    // }
    //
    // @Get('login')
    // idmLogin(@Req() req: Request, @Res() res: Response) {
    //     return this.idmService.idmCallback(req, res);
    // }
}
