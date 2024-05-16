import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'common/entities/cart.entity';
import { CartItem } from 'common/entities/cart_item.entity';
import { ProductVariantModule } from '../product-variant/product-variant.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductVariantModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
