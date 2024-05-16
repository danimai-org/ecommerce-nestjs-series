import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { productVariantPaginateConfig } from './product-variant.pagination';
import { ProductVariant } from 'common/entities/product_variant.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private repository: Repository<ProductVariant>,
  ) {}

  async getOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  async getAll(query: PaginateQuery) {
    return paginate(query, this.repository, productVariantPaginateConfig);
  }
}
