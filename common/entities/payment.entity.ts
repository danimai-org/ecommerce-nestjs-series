import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from './base';
import type { Customer } from './customer.entity';
import type { Order } from './order.entity';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @Column({ type: 'uuid' })
  customer_id: string;

  @ManyToOne('Customer', 'orders')
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({ type: 'uuid' })
  order_id: string;

  @ManyToOne('Order', 'payments')
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @Column()
  transaction_id: string;

  @Column({
    enum: PaymentProvider,
    type: 'enum',
    default: PaymentProvider.STRIPE,
  })
  provider: PaymentProvider;

  @Column({
    enum: PaymentStatus,
    type: 'enum',
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;
}
