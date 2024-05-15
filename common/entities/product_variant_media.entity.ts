import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import type { ProductVariant } from './product_variant.entity';
import type { Media } from './media.entity';

@Entity({ name: 'product_variant_media' })
export class ProductVariantMedia extends BaseEntity {
  @ApiHideProperty()
  @ManyToOne('Media', 'variants')
  @JoinColumn({ name: 'media_id' })
  media: Relation<Media>;

  @ApiHideProperty()
  @Column({ type: 'uuid', nullable: true })
  media_id: string;

  @ApiHideProperty()
  @ManyToOne('ProductVariant', 'media')
  @JoinColumn({ name: 'variant_id' })
  variant: Relation<ProductVariant>;

  @ApiHideProperty()
  @Column({ type: 'uuid', nullable: true })
  variant_id: string;

  @ApiProperty({ example: 'Rank' })
  @Column({ type: 'integer', default: 1 })
  rank: number;
}
