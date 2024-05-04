import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { LoginDto, ResetPasswordDto, SendVerifyMailDto } from '../email.dto';
import { UserService } from '../../user/user.service';
import { TokenService } from '../../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

@Injectable()
export class EmailService {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnprocessableEntityException({ email: 'User not found' });
    }
    if (!user.is_active) {
      throw new UnprocessableEntityException({ email: 'User not active' });
    }
    if (!user.email_verified_at) {
      throw new UnprocessableEntityException({ email: 'User not verified' });
    }
    if (!user.comparePassword(loginDto.password)) {
      throw new UnprocessableEntityException({
        password: 'Password is incorrect',
      });
    }
    return this.authService.createJwtToken(user);
  }

  async sendVerifyMail(sendVerifyMailDto: SendVerifyMailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendVerifyMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException({ email: 'User not found' });
    }
    if (user.email_verified_at) {
      throw new UnprocessableEntityException({
        email: 'User already verified',
      });
    }
    const token = await this.tokenService.create(user, 'REGISTER_VERIFY');
    await this.authService.userRegisterEmail({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async sendForgotMail(sendForgotMailDto: SendVerifyMailDto) {
    const user = await this.userRepository.findOne({
      where: { email: sendForgotMailDto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnprocessableEntityException({ email: 'User not found' });
    }

    if (!user.email_verified_at) {
      throw new UnprocessableEntityException({
        email: 'Please verify email first.',
      });
    }

    const token = await this.tokenService.create(user, 'RESET_PASSWORD');
    await this.authService.forgotPasswordEmail({
      to: user.email,
      data: {
        hash: token.token,
      },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const user = await this.tokenService.verify(
        resetPasswordDto.reset_token,
        'RESET_PASSWORD',
      );
      user.password = resetPasswordDto.password;
      await user.save();
    } catch (e) {
      throw new UnprocessableEntityException({ reset_token: e.message });
    }
  }
}
