import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { CustomerSession } from 'common/entities/customer_session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerSession])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
