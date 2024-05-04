import { ApiProperty } from '@nestjs/swagger';
import { PaginationQuery } from './pagination.dto';

export class PaginationResponse<T> {
  @ApiProperty({
    title: 'Data',
    isArray: true,
  })
  readonly rows: T[];

  @ApiProperty({
    title: 'Total',
  })
  readonly count: number = 0;

  @ApiProperty({
    title: 'Page',
  })
  readonly page: number = 1;

  @ApiProperty({
    title: 'Limit',
  })
  readonly limit: number = 10;

  @ApiProperty({
    title: 'Has Previous Page',
  })
  readonly hasPreviousPage: boolean = false;

  @ApiProperty({
    title: 'Has Next Page',
  })
  readonly hasNextPage: boolean = false;

  constructor(data: T[], total: number, paginationQuery: PaginationQuery) {
    const { limit, page } = paginationQuery;
    this.rows = data;
    this.page = page;
    this.limit = limit;
    this.count = total;
    if (total > page * limit) {
      this.hasNextPage = true;
    }
    if (page > 1) {
      this.hasPreviousPage = true;
    }
  }
}
