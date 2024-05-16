import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from 'common/entities/product_variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
