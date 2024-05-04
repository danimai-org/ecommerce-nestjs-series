import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { CustomerToken } from 'common/entities/customer_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerToken])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
