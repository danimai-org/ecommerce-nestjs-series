import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { CustomerService } from '../customer/customer.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'common/entities/customer.entity';
import { AuthService } from '../auth/services/auth.service';
import { AuthProvider } from '../auth/auth.provider';

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;

  constructor(
    private readonly customerService: CustomerService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    const clientID = this.configService.get('google.auth.client_id');
    const clientSecret = this.configService.get('google.auth.client_secret');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const { email } = await this.oauthClient.getTokenInfo(token);

    const customer = await this.customerRepository.findOneBy({ email });

    if (customer) {
      return this.handleRegisteredCustomer(customer);
    } else {
      return this.registerCustomer(token, email);
    }
  }

  async registerCustomer(token: string, email: string) {
    const { given_name, family_name } = await this.getCustomerData(token);
    const customer = await this.customerService.create({
      email,
      email_verified_at: new Date(),
      first_name: given_name,
      last_name: family_name,
      is_active: true,
      provider: AuthProvider.GOOGLE,
    });
    return this.handleRegisteredCustomer(customer);
  }

  async getCustomerData(token: string) {
    const customerInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const customerInfoResponse = await customerInfoClient.get({
      auth: this.oauthClient,
    });

    return customerInfoResponse.data;
  }

  async handleRegisteredCustomer(customer: Customer) {
    return this.authService.createJwtToken(customer);
  }
}
