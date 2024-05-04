import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from '../auth/services/auth.service';
import { AuthProvider } from '../auth/auth.provider';

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const clientID = this.configService.get('google.auth.client_id');
    const clientSecret = this.configService.get('google.auth.client_secret');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const { email } = await this.oauthClient.getTokenInfo(token);

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      return this.handleRegisteredUser(user);
    } else {
      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const { given_name, family_name } = await this.getUserData(token);
    const user = await this.userService.create({
      email,
      email_verified_at: new Date(),
      first_name: given_name,
      last_name: family_name,
      is_active: true,
      provider: AuthProvider.GOOGLE,
    });
    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(user: User) {
    return this.authService.createJwtToken(user);
  }
}
