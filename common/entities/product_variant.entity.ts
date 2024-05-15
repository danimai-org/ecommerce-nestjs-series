import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import type { Product } from './product.entity';
import type { ProductVariantMedia } from './product_variant_media.entity';

@Entity({ name: 'product_variants' })
export class ProductVariant extends BaseEntity {
  @ApiProperty({ example: 'Metadata' })
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ApiProperty({ example: 'Product Id' })
  @Column({ type: 'uuid' })
  product_id: string;

  @ManyToOne('Product', 'variants')
  @JoinColumn({ name: 'product_id' })
  product: Relation<Product>;

  @OneToMany('ProductVariantMedia', 'variant')
  media: Relation<ProductVariantMedia>;

  @ApiProperty({ example: 'Price' })
  @Column({ type: 'decimal' })
  price: number;

  @ApiProperty({ example: 'Rank' })
  @Column({ type: 'integer', default: 1 })
  rank: number;
}
