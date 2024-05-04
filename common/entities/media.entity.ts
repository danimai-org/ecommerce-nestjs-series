import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';

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

  @OneToMany(() => User, (user) => user.avatar)
  avatars: User;
}
