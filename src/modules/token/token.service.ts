import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Token, TokenType } from 'src/entities/user_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async create(
    user: User,
    type: keyof typeof TokenType = 'REGISTER_VERIFY',
    expires_at: Date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  ) {
    const token = Token.create({
      user_id: user.id,
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
    return tokenEntity.user;
  }
}
