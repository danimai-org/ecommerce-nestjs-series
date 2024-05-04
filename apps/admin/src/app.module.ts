import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoads } from '../../../common/modules/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from '../../../common/modules/database/typeorm.factory';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from '../../../common/modules/mail/mailerConfig.service';
import { PostModule } from './post/post.module';

const modules = [AuthModule, UserModule, PostModule];

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
export class AdminModule {}
