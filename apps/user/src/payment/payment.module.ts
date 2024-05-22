import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'common/entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderModule } from '../order/order.module';
import { AddressModule } from '../address/address.module';
import { CartModule } from '../cart/cart.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    forwardRef(() => OrderModule),
    AddressModule,
    CartModule,
    forwardRef(() => StripeModule),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
