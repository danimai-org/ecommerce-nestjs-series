import { Controller, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GoogleOAuthDto } from './google.dto';
import { GoogleService } from './google.service';

@Controller({ path: 'google-auth', version: '1' })
@ApiTags('Auth Google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  @ApiOkResponse({
    description: 'Register/Login with google',
  })
  async authenticate(@Body() tokenData: GoogleOAuthDto) {
    return this.googleService.authenticate(tokenData.token);
  }
}
