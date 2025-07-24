import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from 'src/entities';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class AccessTokenService {
    private readonly logger = new Logger(AccessTokenService.name);
    private readonly TOKEN_EXPIRATION_MONTHS = 6;

    constructor(
        @InjectRepository(AccessToken)
        private accessTokenRepository: Repository<AccessToken>,
    ) {}

    async saveAccessToken(token: string, userId: string, schoolId: number) {
        try {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + this.TOKEN_EXPIRATION_MONTHS); // Set expiration to half a year from now

            const newAccessToken = this.accessTokenRepository.create({
                token,
                userId,
                schoolId,
                expirationDate,
            });
            await this.accessTokenRepository.save(newAccessToken);
        } catch (error) {
            this.logger.error(`Error generating access token: ${error.message}`);
            throw new Error('Failed to generate access token.');
        }
    }

    async removeAccessToken(token: string) {
        try {
            const deletedCount = await this.accessTokenRepository.delete({ token });

            if (deletedCount.affected === 0) {
                this.logger.log('Access token not found.' + token);
            } else this.logger.log(`Access token removed: ${token}`);
        } catch (error) {
            this.logger.error(`Error removing access token: ${error.message}`);
        }
    }

    async removeAccessTokenByUserId(userId: string, schoolId: number) {
        try {
            await this.accessTokenRepository.delete({ userId, schoolId });

            this.logger.log(`Access token removed with the user id: ${userId} in schoolId ${schoolId}`);
        } catch (error) {
            this.logger.error(`Error removing access token: ${error.message}`);
        }
    }

    // when deleting a school, we need to delete all access tokens related to that school
    async removeAccessTokenBySchoolId(schoolId: number) {
        try {
            const deletedCount = await this.accessTokenRepository.delete({ schoolId });

            this.logger.log(
                `all access token removed with the school id: ${schoolId}, deleted ${deletedCount.affected} tokens`,
            );
        } catch (error) {
            this.logger.error(`Error removing access token: ${error.message}`);
        }
    }

    async validateAccessToken(token: string): Promise<boolean> {
        try {
            const currentDate = new Date();

            const accessToken = await this.accessTokenRepository.findOne({
                where: {
                    token,
                    expirationDate: MoreThanOrEqual(currentDate),
                },
            });

            return !!accessToken; // Returns true if the token exists, false otherwise
        } catch (error) {
            this.logger.error(`Error validating access token: ${error.message}`);
            throw new Error('Failed to validate access token.');
        }
    }
}
