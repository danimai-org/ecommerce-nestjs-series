import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  EmailVerifyDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendVerifyMailDto,
} from './email.dto';
import { EmailService } from './email.service';

@ApiTags('Auth Email')
@Controller({
  path: 'auth/email',
  version: '1',
})
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register by email' })
  @ApiCreatedResponse({
    description: 'User successfully registered.',
  })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.emailService.register(registerDto);
  }

  @Post('/verify')
  @ApiOperation({ summary: 'Verify Email address.' })
  @ApiAcceptedResponse({
    description: 'Email verified successfully.',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async verify(@Body() emailVerifyDto: EmailVerifyDto) {
    return this.emailService.verify(emailVerifyDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Log in with Email.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.emailService.login(loginDto);
  }

  @Post('/send-verify-email')
  @ApiOperation({ summary: 'Send Verification mail.' })
  @ApiNoContentResponse({
    description: 'Sent Verification mail.',
  })
  @ApiForbiddenResponse({
    description: 'User already verified.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendVerifyMail(@Body() sendVerifyMailDto: SendVerifyMailDto) {
    return this.emailService.sendVerifyMail(sendVerifyMailDto);
  }

  @Post('/reset-password-request')
  @ApiOperation({ summary: 'Send Reset Password mail.' })
  @ApiNoContentResponse({
    description: 'Sent Reset Password mail.',
  })
  @ApiForbiddenResponse({
    description: 'Please verify email first.',
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendForgotMail(@Body() sendForgotMailDto: SendVerifyMailDto) {
    return this.emailService.sendForgotMail(sendForgotMailDto);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Password Reset.' })
  @ApiNoContentResponse({
    description: 'Password Reset Successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid Reset token',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.emailService.resetPassword(resetPasswordDto);
  }
}
