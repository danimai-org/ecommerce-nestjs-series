import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base';
import type { User } from './user.entity';

@Entity({ name: 'user_sessions' })
export class Session extends BaseEntity {
  @ManyToOne('User', 'sessions', { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @Column({ type: 'uuid' })
  @Index()
  user_id: string;
}
