import { SelectQueryBuilder } from 'typeorm';
import { PaginationQuery } from './pagination.dto';

export const paginate = <T>(
  query: SelectQueryBuilder<T>,
  paginationQuery: PaginationQuery,
) => {
  const { page, limit } = paginationQuery;
  return query.take(limit).skip((page - 1) * limit);
};
