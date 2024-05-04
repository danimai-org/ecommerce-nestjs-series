import { Module } from '@nestjs/common';
import { EmailController } from '../auth-email/email.controller';
import { EmailService } from '../auth-email/email.service';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenModule } from '../token/token.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SessionModule } from '../session/session.module';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    TokenModule,
    SessionModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: {
          expiresIn: configService.get('auth.refreshTokenExpiresIn'),
        },
      }),
    }),
  ],
  controllers: [EmailController, AuthController],
  providers: [EmailService, AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
