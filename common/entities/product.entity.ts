import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import type { ProductVariant } from './product_variant.entity';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @ApiProperty({ example: 'Product title' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'Product description' })
  @Column({ type: 'text' })
  description: string;

  @OneToMany('ProductVariant', 'product')
  variants: Relation<ProductVariant[]>;
}
