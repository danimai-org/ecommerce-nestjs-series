import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  EmailVerifyDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendVerifyMailDto,
} from '../email.dto';
import { CustomerService } from '../../customer/customer.service';
import { TokenService } from '../../token/token.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'common/entities/customer.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { AuthProvider } from '../auth.provider';

@Injectable()
export class EmailService {
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private tokenService: TokenService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async register(registerDto: RegisterDto) {
    const customer = await this.customerService.create(registerDto);
    const token = await this.tokenService.create(customer, 'REGISTER_VERIFY');
    await this.authService.customerRegisterEmail({
      to: customer.email,
      data: {
        hash: token.token,
      },
    });
  }

  async verify(verifyDto: EmailVerifyDto) {
    try {
      const customer = await this.tokenService.verify(
        verifyDto.verify_token,
        'REGISTER_VERIFY',
      );
      customer.email_verified_at = new Date();
      customer.is_active = true;
      await customer.save();
    } catch (e) {
      throw new UnprocessableEntityException({ verify_token: e.message });
    }
  }

  async login(loginDto: LoginDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: loginDto.email.toLowerCase() },
    });
    if (customer.provider !== AuthProvider.EMAIL) {
      throw new UnprocessableEntityException({
        email: `Customer is registered with ${customer.provider}`,
      });
    }
    if (!customer) {
      throw new UnprocessableEntityException({ email: 'Customer not found' });
    }
    if (!customer.is_active) {
      throw new UnprocessableEntityException({ email: 'Customer not active' });
    }
    if (!customer.email_verified_at) {
      throw new UnprocessableEntityException({
        email: 'Customer not verified',
      });
    }
    if (!customer.comparePassword(loginDto.password)) {
      throw new UnprocessableEntityException({
        password: 'Password is incorrect',
      });
    }
    return this.authService.createJwtToken(customer);
  }

  async sendVerifyMail(sendVerifyMailDto: SendVerifyMailDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: sendVerifyMailDto.email.toLowerCase() },
    });

    if (!customer) {
      throw new NotFoundException({ email: 'Customer not found' });
    }
    if (customer.email_verified_at) {
      throw new UnprocessableEntityException({
        email: 'Customer already verified',
      });
    }
    const token = await this.tokenService.create(customer, 'REGISTER_VERIFY');
    await this.authService.customerRegisterEmail({
      to: customer.email,
      data: {
        hash: token.token,
      },
    });
  }

  async sendForgotMail(sendForgotMailDto: SendVerifyMailDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: sendForgotMailDto.email.toLowerCase() },
    });

    if (!customer) {
      throw new UnprocessableEntityException({ email: 'Customer not found' });
    }

    if (!customer.email_verified_at) {
      throw new UnprocessableEntityException({
        email: 'Please verify email first.',
      });
    }

    const token = await this.tokenService.create(customer, 'RESET_PASSWORD');
    await this.authService.forgotPasswordEmail({
      to: customer.email,
      data: {
        hash: token.token,
      },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const customer = await this.tokenService.verify(
        resetPasswordDto.reset_token,
        'RESET_PASSWORD',
      );
      customer.password = resetPasswordDto.password;
      await customer.save();
    } catch (e) {
      throw new UnprocessableEntityException({ reset_token: e.message });
    }
  }
}
