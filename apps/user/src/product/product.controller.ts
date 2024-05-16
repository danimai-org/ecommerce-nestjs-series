import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { productPaginateConfig } from './product.pagination';
import { ProductService } from './product.service';
import { IsIDExistPipe } from 'common/pipes/IsIDExist.pipe';
import { Product } from 'common/entities/product.entity';

@ApiTags('Product')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductController {
  constructor(private service: ProductService) {}

  @Get()
  @ApiPaginationQuery(productPaginateConfig)
  async getAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Get(':id')
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  async getOne(
    @Param(
      'id',
      ParseUUIDPipe,
      IsIDExistPipe({
        entity: Product,
        relations: {
          variants: {
            media: true,
          },
        },
      }),
    )
    product: Product,
  ) {
    return product;
  }
}
