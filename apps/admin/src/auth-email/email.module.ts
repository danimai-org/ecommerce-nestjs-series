import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'common/entities/user.entity';
import { TokenModule } from '../token/token.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    UserModule,
    TokenModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailAuthModule {}
