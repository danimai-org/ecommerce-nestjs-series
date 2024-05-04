import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { Customer } from './customer.entity';

@Entity({ name: 'customer_sessions' })
export class CustomerSession extends BaseEntity {
  @ManyToOne(() => Customer, (customer) => customer.sessions, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'uuid' })
  @Index()
  customer_id: string;
}
