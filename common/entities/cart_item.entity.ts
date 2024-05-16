import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './base';
import { ApiProperty } from '@nestjs/swagger';
import type { Cart } from './cart.entity';
import type { ProductVariant } from './product_variant.entity';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

@Entity({ name: 'cart_items' })
export class CartItem extends BaseEntity {
  @ApiProperty()
  @IsUUID('4')
  @Column({ type: 'uuid' })
  variant_id: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(10)
  @Column()
  quantity: number;

  @ApiProperty()
  @Column({ type: 'uuid' })
  cart_id: string;

  @ManyToOne('Cart', 'items')
  @JoinColumn({ name: 'cart_id' })
  cart: Relation<Cart>;

  @ManyToOne('ProductVariant', 'cartItems')
  @JoinColumn({ name: 'variant_id' })
  variant: Relation<ProductVariant>;
}
