import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoads } from './modules/user/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from './modules/user/database/typeorm.factory';
import { AuthModule } from './modules/user/auth/auth.module';
import { UserModule } from './modules/user/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from './modules/user/mail/mailerConfig.service';
import { GoogleAuthModule } from './modules/user/auth-google/google.module';
import { PostModule } from './modules/user/post/post.module';

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
export class AppModule {}
