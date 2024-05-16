import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import type { CustomerToken } from './customer_token.entity';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import type { Media } from './media.entity';
import type { CustomerSession } from './customer_session.entity';
import type { Address } from './address.entity';
import type { Cart } from './cart.entity';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  EMAIL = 'EMAIL',
}

@Entity({ name: 'customers' })
export class Customer extends BaseEntity {
  @ApiProperty({ example: 'Danimai' })
  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @ApiProperty({ example: 'Mandal' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  last_name: string;

  @ApiProperty({ example: 'example@danimai.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ example: '77220646XX' })
  @Column({ type: 'varchar', length: 13, unique: true })
  phone_number: string;

  @ApiProperty({ example: '91' })
  @Column({ type: 'varchar', length: 3 })
  country_code: string;

  @ApiProperty({ example: 'Password@123' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  email_verified_at: Date;

  @ApiHideProperty()
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @ApiHideProperty()
  @Column({ default: AuthProvider.EMAIL, enum: AuthProvider })
  provider: AuthProvider;

  @ApiHideProperty()
  @OneToMany('CustomerToken', 'customer')
  tokens: Relation<CustomerToken[]>;

  @ApiHideProperty()
  @Exclude()
  previousPassword: string;

  @ApiHideProperty()
  @ManyToOne('Media', 'avatars')
  @JoinColumn({ name: 'avatar_id' })
  avatar: Relation<Media>;

  @ApiHideProperty()
  @Column({ type: 'uuid', nullable: true })
  avatar_id: string;

  @ApiHideProperty()
  @OneToMany('CustomerSession', 'customer')
  sessions: Relation<CustomerSession[]>;

  @OneToMany('Address', 'customer')
  addresses: Relation<Address[]>;

  @OneToMany('Cart', 'customer')
  carts: Relation<Cart[]>;

  @AfterLoad()
  storePasswordInCache() {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
    this.email = this.email.toLowerCase();
  }

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}
