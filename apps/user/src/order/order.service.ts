import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from 'common/entities/order.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { orderPaginateConfig } from './order.pagination';
import { CartService } from '../cart/cart.service';
import { Customer } from 'common/entities/customer.entity';
import { Address } from 'common/entities/address.entity';
import { Payment } from 'common/entities/payment.entity';
import { Cart } from 'common/entities/cart.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private cartService: CartService,
  ) {}

  async getAll(query: PaginateQuery, customer: Customer) {
    return paginate(
      {
        ...query,
        filter: {
          ...query.filter,
          customer_id: customer.id,
        },
      },
      this.orderRepository,
      orderPaginateConfig,
    );
  }

  async upsert(customer: Customer, address: Address, cart: Cart) {
    if (!cart?.items?.length) {
      throw new ForbiddenException({
        cart: 'Cart should contain atleast 1 item.',
      });
    }
    let order = await this.orderRepository.findOneBy({
      cart_id: cart.id,
    });

    if (!order) {
      order = await this.orderRepository.save({
        cart_id: cart.id,
        customer_id: customer.id,
        address_id: address.id,
      });
    }
    if (order.address_id !== address.id) {
      order.address_id = address.id;
      await order.save();
    }

    return order;
  }

  async getOrderById(id: string) {
    return this.orderRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        address: true,
      },
    });
  }

  // below functions freezes the order details after payment success, failed or canceled.
  async afterPaymentConcluded(
    order: Order,
    status: OrderStatus,
    payment: Payment,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(order.customer);

    // freeze all the cart items with price
    const cartItemPrices = cart.items.map((item) => ({
      id: item.id,
      price: item.variant.price,
    }));

    await this.cartService.updateCartItemPrices(cartItemPrices);

    // freeze cart
    cart.is_order_created = true;
    await cart.save();

    // freeze address details in order
    order.static_address = order.address;
    order.status = status;
    order.success_payment_id = payment.id;
    return order.save();
  }
}
