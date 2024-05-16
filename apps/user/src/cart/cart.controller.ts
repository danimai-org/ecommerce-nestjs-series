import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTags,
  PickType,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Customer } from 'common/entities/customer.entity';
import { UserParam } from 'common/decorators/user.decorator';
import { CartItem } from 'common/entities/cart_item.entity';
import { IsIDExistPipe } from 'common/pipes/IsIDExist.pipe';

@ApiTags('Cart')
@Controller({
  path: 'carts',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private service: CartService) {}

  @Get()
  async getOrCreate(
    @UserParam()
    customer: Customer,
  ) {
    return this.service.getOrCreateActiveCart(customer);
  }

  @Post('upsert-item')
  @ApiBody({
    type: PickType(CartItem, ['variant_id', 'quantity']),
  })
  async updateActiveCart(
    @Body() itemUpdateDto: CartItem,
    @UserParam()
    customer: Customer,
  ) {
    return this.service.updateActiveCart(itemUpdateDto, customer);
  }

  @Post('empty-cart')
  async emptyActiveCart(
    @UserParam()
    customer: Customer,
  ) {
    return this.service.emptyActiveCart(customer);
  }

  @Delete('cart-items/:id')
  @ApiParam({
    type: 'string',
    format: 'uuid',
    name: 'id',
  })
  async removeCart(
    @Param(
      'id',
      ParseUUIDPipe,
      IsIDExistPipe({ entity: CartItem, relations: { cart: true } }),
    )
    cartItem: any,
    @UserParam()
    customer: Customer,
  ) {
    return this.service.removeItem(cartItem, customer);
  }
}
