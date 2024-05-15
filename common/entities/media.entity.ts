import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from './base';
import type { User } from './user.entity';
import type { ProductVariantMedia } from './product_variant_media.entity';

export enum StorageType {
  LOCAL = 'LOCAL',
  S3 = 'S3',
}

@Entity({ name: 'media' })
export class Media extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 150 })
  mimetype: string;

  @Column({ type: 'enum', enum: StorageType, default: StorageType.LOCAL })
  storage_type: StorageType;

  @Column({ type: 'int' })
  size: number;

  @OneToMany('User', 'avatar')
  avatars: User;

  @OneToMany('ProductVariantMedia', 'media')
  variants: Relation<ProductVariantMedia>;
}
