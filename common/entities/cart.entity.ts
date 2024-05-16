import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base';
import type { Customer } from './customer.entity';
import type { CartItem } from './cart_item.entity';

@Entity({ name: 'carts' })
export class Cart extends BaseEntity {
  @Column({ type: 'uuid' })
  customer_id: string;

  @ManyToOne('Customer', 'carts')
  @JoinColumn({ name: 'customer_id' })
  customer: Relation<Customer>;

  @OneToMany('CartItem', 'cart')
  items: Relation<CartItem[]>;

  @Column({ default: false })
  is_order_created: boolean;
}
