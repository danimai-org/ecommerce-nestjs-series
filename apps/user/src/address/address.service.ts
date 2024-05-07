import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceFactory } from 'common/crud/crud.service';
import { Address } from 'common/entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService extends ServiceFactory({
  entity: Address,
  paginateConfig: { sortableColumns: ['created_at'] },
}) {
  constructor(@InjectRepository(Address) repository: Repository<Address>) {
    super();
    this.repository = repository;
  }
}
