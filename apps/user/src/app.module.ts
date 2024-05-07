import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoads } from '../../../common/modules/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from 'common/modules/database/typeorm.factory';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from '../../../common/modules/mail/mailerConfig.service';
import { GoogleAuthModule } from './auth-google/google.module';
import { CustomerModule } from './customer/customer.module';
import { EmailAuthModule } from './auth-email/email.module';
import { AddressModule } from './address/address.module';

const modules = [
  AuthModule,
  EmailAuthModule,
  GoogleAuthModule,
  CustomerModule,
  AddressModule,
];

export const global_modules = [
  ConfigModule.forRoot({
    load: configLoads,
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  TypeOrmModule.forRootAsync({
    useClass: TypeORMConfigFactory,
  }),
  MailerModule.forRootAsync({
    useClass: MailerConfigClass,
  }),
];

@Module({
  imports: [...global_modules, ...modules],
})
export class UserAppModule {}
