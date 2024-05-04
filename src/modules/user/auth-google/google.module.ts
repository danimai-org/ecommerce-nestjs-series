import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { AuthModule } from '../auth/auth.module';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from 'src/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), CustomerModule, AuthModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleAuthModule {}
