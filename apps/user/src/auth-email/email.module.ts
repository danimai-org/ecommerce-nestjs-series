import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token/token.module';
import { Customer } from 'common/entities/customer.entity';
import { CustomerModule } from '../customer/customer.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    CustomerModule,
    TokenModule,
    AuthModule,
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailAuthModule {}
