import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'common/entities/product.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { productPaginateConfig } from './product.pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async getAll(query: PaginateQuery) {
    return paginate(query, this.repository, productPaginateConfig);
  }
}
