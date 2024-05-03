import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import { User } from './user.entity';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ValidationGroup } from 'src/crud/validation-group';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @ApiProperty({ example: 'Here is my title.' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'My content' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @IsString({ always: true })
  @Column({ type: 'text' })
  content: string;

  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @ApiProperty()
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  user_id: string;
}
