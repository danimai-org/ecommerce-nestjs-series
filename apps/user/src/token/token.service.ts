import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'common/entities/customer.entity';
import {
  CustomerToken,
  TokenType,
} from 'common/entities/customer_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(CustomerToken)
    private readonly tokenRepository: Repository<CustomerToken>,
  ) {}

  async create(
    customer: Customer,
    type: keyof typeof TokenType = 'REGISTER_VERIFY',
    expires_at: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  ) {
    const token = CustomerToken.create({
      customer_id: customer.id,
      type: TokenType[type],
      expires_at,
    });
    return this.tokenRepository.save(token);
  }

  async verify(token: string, type: keyof typeof TokenType) {
    const tokenEntity = await this.tokenRepository.findOne({
      relations: ['user'],
      loadEagerRelations: true,
      where: { token, type: TokenType[type], is_used: false },
    });
    if (!tokenEntity) {
      throw new Error('Token not found');
    }
    if (tokenEntity.expires_at < new Date()) {
      throw new Error('Token expired');
    }
    tokenEntity.is_used = true;
    await tokenEntity.save();
    return tokenEntity.customer;
  }
}
