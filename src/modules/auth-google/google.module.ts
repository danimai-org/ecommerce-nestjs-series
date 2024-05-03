import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule, AuthModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleAuthModule {}
