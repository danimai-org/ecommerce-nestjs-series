import { Order } from 'common/entities/order.entity';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export const orderPaginateConfig: PaginateConfig<Order> = {
  sortableColumns: ['created_at'],
  defaultSortBy: [['created_at', 'DESC']],
  relations: ['success_payment', 'cart', 'cart.items', 'cart.items.variant'],
  maxLimit: 30,
  defaultLimit: 10,
  filterableColumns: {
    id: [FilterOperator.IN],
  },
};
