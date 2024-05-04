import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoads } from '../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from '../database/typeorm.factory';
import { AuthModule } from './auth/auth.module';
import { UserModule } from '../admin/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from '../mail/mailerConfig.service';
import { GoogleAuthModule } from './auth-google/google.module';
import { PostModule } from './post/post.module';

const modules = [AuthModule, UserModule, GoogleAuthModule, PostModule];

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
