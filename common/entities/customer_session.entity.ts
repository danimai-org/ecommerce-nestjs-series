import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base';
import type { Customer } from './customer.entity';

@Entity({ name: 'customer_sessions' })
export class CustomerSession extends BaseEntity {
  @ManyToOne('Customer', 'sessions', { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @Column({ type: 'uuid' })
  @Index()
  customer_id: string;
}
