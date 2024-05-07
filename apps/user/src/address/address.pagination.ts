import { Address } from 'common/entities/address.entity';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export const addressPaginateConfig: PaginateConfig<Address> = {
  sortableColumns: ['created_at'],
  defaultSortBy: [['created_at', 'DESC']],
  searchableColumns: [
    'name',
    'address',
    'first_name',
    'last_name',
    'city',
    'state',
  ],
  maxLimit: 50,
  defaultLimit: 10,
  filterableColumns: { name: [FilterOperator.EQ] },
};
