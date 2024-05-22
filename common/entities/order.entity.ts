import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base';
import type { Customer } from './customer.entity';
import type { Address } from './address.entity';
import type { Payment } from './payment.entity';

export enum OrderStatus {
  CREATED = 'CREATED',
  SUCCEEDED = 'SUCCEEDED',
  CANCELED = 'CANCELED',
}

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
  @Column({ type: 'uuid' })
  customer_id: string;

  @ManyToOne('Customer', 'orders')
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({ type: 'uuid' })
  cart_id: string;

  @ManyToOne('Cart', 'orders')
  @JoinColumn({ name: 'cart_id' })
  cart: Relation<Customer>;

  @Column({ type: 'uuid' })
  address_id: string;

  @ManyToOne('Address', 'orders')
  @JoinColumn({ name: 'address_id' })
  address: Relation<Address>;

  @OneToMany('Payment', 'order')
  payments: Relation<Payment[]>;

  @Column({ type: 'jsonb', nullable: true })
  static_address: Address;

  @Column({ type: 'uuid', nullable: true })
  success_payment_id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.CREATED })
  status: OrderStatus;

  @OneToOne('Payment', 'order')
  success_payment: Relation<Payment>;
}
