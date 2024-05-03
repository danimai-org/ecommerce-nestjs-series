import { Module } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { Token } from 'src/entities/user_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
