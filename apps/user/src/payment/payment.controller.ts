import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaymentService } from './payment.service';
import { paymentPaginateConfig } from './payment.pagination';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserParam } from 'common/decorators/user.decorator';
import { Customer } from 'common/entities/customer.entity';

@ApiTags('Payment')
@Controller({
  path: 'payments',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Get()
  @ApiPaginationQuery(paymentPaginateConfig)
  async getAll(@Paginate() query: PaginateQuery) {
    return this.service.getAll(query);
  }

  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @UserParam() customer: Customer,
  ) {
    return this.service.create(createPaymentDto, customer);
  }
}
