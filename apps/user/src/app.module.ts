import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configLoads } from '../../../common/modules/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfigFactory } from 'common/modules/database/typeorm.factory';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigClass } from '../../../common/modules/mail/mailerConfig.service';
import { GoogleAuthModule } from './auth-google/google.module';
import { CustomerModule } from './customer/customer.module';
import { EmailAuthModule } from './auth-email/email.module';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CartModule } from './cart/cart.module';
import { StripeModule } from './stripe/stripe.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

const modules = [
  AuthModule,
  EmailAuthModule,
  GoogleAuthModule,
  CustomerModule,
  AddressModule,
  ProductModule,
  ProductVariantModule,
  CartModule,
  PaymentModule,
  OrderModule,
  forwardRef(() => StripeModule),
];

export const global_modules = [
  ConfigModule.forRoot({
    load: configLoads,
    isGlobal: true,
    envFilePath: ['.env'],
  }),
  TypeOrmModule.forRootAsync({
    useClass: TypeORMConfigFactory,
  }),
  MailerModule.forRootAsync({
    useClass: MailerConfigClass,
  }),
];

@Module({
  imports: [...global_modules, ...modules],
})
export class UserAppModule {}
