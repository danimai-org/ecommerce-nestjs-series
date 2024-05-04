import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from 'src/entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { MediaModule } from '../../media/media.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '../../media/multer_config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    MediaModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
