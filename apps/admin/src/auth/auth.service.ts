import { Injectable } from '@nestjs/common';
import { User } from 'common/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailData } from 'common/modules/mail/mail.interface';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private sessionService: SessionService,
  ) {}

  async createJwtToken(user: User) {
    const refreshTokenExpiresIn = this.configService.get(
      'auth.refreshTokenExpiresIn',
    );
    const session = await this.sessionService.create(user);

    const accessToken = await this.createAccessToken(session.id);
    const refreshToken = this.jwtService.sign(
      {
        id: session.id,
        type: 'REFRESH',
      },
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async createAccessToken(sessionId: string) {
    const accessTokenExpiresIn = this.configService.get(
      'auth.accessTokenExpiresIn',
    );

    const payload = {
      id: sessionId,
      type: 'ACCESS',
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: accessTokenExpiresIn,
    });

    return accessToken;
  }

  async userRegisterEmail(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Thank You For Registration, Verify Your Account.',
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/auth/verify?token=${mailData.data.hash}`,
      template: 'auth/registration',
      context: {
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/auth/verify?token=${mailData.data.hash}`,
        app_name: this.configService.get('app.name'),
        title: 'Thank You For Registration, Verify Your Account.',
        actionTitle: 'Verify Your Account',
      },
    });
  }

  async forgotPasswordEmail(
    mailData: MailData<{
      hash: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Here is your Link for Reset Password.',
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/auth/reset-password?token=${mailData.data.hash}`,
      template: 'auth/registration',
      context: {
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/auth/reset-password?token=${mailData.data.hash}`,
        app_name: this.configService.get('app.name'),
        title: 'Here is your Link for Reset Password.',
        actionTitle: 'Reset Password',
      },
    });
  }
}
