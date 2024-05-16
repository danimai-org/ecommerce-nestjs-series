import { Product } from 'common/entities/product.entity';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export const productPaginateConfig: PaginateConfig<Product> = {
  sortableColumns: ['created_at', 'variants.price', 'title'],
  defaultSortBy: [['created_at', 'DESC']],
  searchableColumns: ['title', 'description', 'variants.metadata'],
  relations: ['variants', 'variants.media'],
  maxLimit: 50,
  defaultLimit: 10,
  filterableColumns: {
    id: [FilterOperator.IN],
    title: [FilterOperator.EQ, FilterOperator.ILIKE],
    description: [FilterOperator.ILIKE],
    'variants.metadata': [FilterOperator.EQ, FilterOperator.ILIKE],
    'variants.price': [
      FilterOperator.EQ,
      FilterOperator.GTE,
      FilterOperator.LTE,
    ],
  },
};
