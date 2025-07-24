import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { Gender } from 'src/common/enums';
import { getSchoolSymbols } from 'src/common/functions/getSchoolSymbol.functions';
import { StaffService } from 'src/staff/staff.service';
import { Issuer, BaseClient } from 'openid-client';

@Injectable()
export class IdmService {
    private redirectURL: string;
    private idmIssuer: Issuer<BaseClient>;
    client: BaseClient;

    constructor(private staffService: StaffService) {
        this.redirectURL = process.env.SERVER_DOMAIN + '/api/idm/login';

        //TODO: once we have a client id and secret we activate this
        // const node_env = process.env.NODE_ENV as keyof typeof idmDomain
        // this.idmIssuer = new Issuer({
        //     issuer: `https://${idmDomain[node_env]}/nidp/oauth/nam`,
        //     authorization_endpoint: `https://${idmDomain[node_env]}/nidp/oauth/nam/authz`,
        //     token_endpoint: `https://${idmDomain[node_env]}/nidp/oauth/nam/token`,
        //     registration_endpoint: `https://${idmDomain[node_env]}/nidp/oauth/nam/clients`,
        //     revocation_endpoint: `https://${idmDomain[node_env]}/nidp/oauth/nam/revoke`,
        //     userinfo_endpoint: `https://${idmDomain[node_env]}/nidp/oauth/nam/userinfo`,
        //     jwks_uri: `https://${idmDomain[node_env]}/nidp/oauth/nam/keys`,
        // })
        // this.client = new this.idmIssuer.Client({
        //     client_id: "fake",
        //     client_secret: "fake",
        //     token_endpoint_auth_method: "client_secret_basic",
        //     id_token_signed_response_alg: "RS256",
        //     grant_type: "authorization_code",
        //     redirect_uri: this.redirectURL,
        //     response_type: 'code',
        //     tls_client_certificate_bound_access_tokens: false,
        // });
    }

    async idmCallback(req: Request, res: Response) {
        //get info from idm callback
        const fakeUser = {
            zehut: faker.string.uuid().slice(0, 10),
            orgrolecomplex: ['667[mosad:420208]', '667[mosad:111690]'],
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            gender: Gender.MALE,
        };
        const { zehut, orgrolecomplex, firstName, gender, lastName } = fakeUser;
        const schoolCodes = getSchoolSymbols(orgrolecomplex);
        await this.staffService.loginByIdm(
            {
                schoolCodes,
                zehut,
                firstName,
                gender,
                lastName,
            },
            res,
        );
    }
}
