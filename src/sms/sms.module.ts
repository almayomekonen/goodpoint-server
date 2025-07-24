import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sms } from '../entities';

@Module({ imports: [TypeOrmModule.forFeature([Sms])] })
export class SmsModule {}
