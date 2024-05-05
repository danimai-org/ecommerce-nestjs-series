import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { User } from './user.entity';

@Entity({ name: 'user_sessions' })
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sessions, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'uuid' })
  @Index()
  user_id: string;
}
