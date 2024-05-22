import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { IsIDExistPipe } from 'common/pipes/IsIDExist.pipe';
import { OrderService } from './order.service';
import { orderPaginateConfig } from './order.pagination';
import { Order } from 'common/entities/order.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Order')
@Controller({
  path: 'orders',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private service: OrderService) {}

  @Get()
  @ApiPaginationQuery(orderPaginateConfig)
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
        entity: Order,
      }),
    )
    order: Order,
  ) {
    return order;
  }
}
