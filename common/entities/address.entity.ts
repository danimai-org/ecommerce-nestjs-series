import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './base';
import type { Customer } from './customer.entity';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ValidationGroup } from 'common/crud/validation-group';

@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  @ApiProperty({ example: 'Deepak' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @Column()
  first_name: string;

  @ApiProperty({ example: 'Mandal' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  last_name: string;

  @ApiProperty({ example: 'Home' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  name: string;

  @ApiProperty({ example: 'John Does Road' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  address: string;

  @ApiProperty({ example: 'Nagpur' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  city: string;

  @ApiProperty({ example: 'Maharashtra' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  state: string;

  @ApiProperty({ example: 'India' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  country: string;

  @ApiProperty({ example: '469XXX' })
  @IsOptional({ groups: [ValidationGroup.UPDATE] })
  @MaxLength(255, { always: true })
  @IsString({ always: true })
  @Column()
  zip_code: string;

  @ManyToOne('Customer', 'addresses')
  @JoinColumn({ name: 'customer_id' })
  addresses: Relation<Customer>[];

  @ApiProperty()
  @Column({ type: 'uuid' })
  customer_id: string;
}
