import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SessionService } from 'src/modules/admin/session/session.service';

export type JwtPayload = {
  id: string;
  type: 'ACCESS' | 'REFRESH';
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret'),
      ignoreExpiration: false,
    });
  }

  public async validate(payload: JwtPayload) {
    try {
      if (payload.type !== 'ACCESS') {
        throw new UnauthorizedException('Invalid token provided.');
      }
      const session = await this.sessionService.get(payload.id);

      if (!session) {
        throw new UnauthorizedException('Invalid token provided.');
      }

      const { user } = session;
      if (!user.email_verified_at) {
        throw new UnauthorizedException('Please verify your email.');
      }

      if (!user.is_active) {
        throw new ForbiddenException('Your account is not active.');
      }
      return session;
    } catch {
      throw new UnauthorizedException('User is not authorized.');
    }
  }
}
