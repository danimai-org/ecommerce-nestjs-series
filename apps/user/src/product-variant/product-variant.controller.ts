import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { productVariantPaginateConfig } from './product-variant.pagination';
import { ProductVariantService } from './product-variant.service';
import { IsIDExistPipe } from 'common/pipes/IsIDExist.pipe';
import { Product } from 'common/entities/product.entity';
import { ProductVariant } from 'common/entities/product_variant.entity';

@ApiTags('Product Variant')
@Controller({
  path: 'product-variants',
  version: '1',
})
export class ProductVariantController {
  constructor(private service: ProductVariantService) {}

  @Get()
  @ApiPaginationQuery(productVariantPaginateConfig)
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
        entity: ProductVariant,
        relations: {
          media: true,
        },
      }),
    )
    product: Product,
  ) {
    return product;
  }
}
