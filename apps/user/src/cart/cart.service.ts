import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'common/entities/cart.entity';
import { Customer } from 'common/entities/customer.entity';
import { CartItem } from 'common/entities/cart_item.entity';
import { ProductVariantService } from '../product-variant/product-variant.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private variantService: ProductVariantService,
  ) {}

  async getOrCreateActiveCart(customer: Customer) {
    const cart = await this.cartRepository.findOne({
      where: { customer_id: customer.id, is_order_created: false },
      relations: { items: { variant: { product: true } } },
    });
    if (!cart) {
      return this.cartRepository.save({
        customer_id: customer.id,
      });
    }
    return cart;
  }

  async updateActiveCart(
    itemUpdateDto: Pick<CartItem, 'variant_id' | 'quantity'>,
    customer: Customer,
  ) {
    const variant = await this.variantService.getOne(itemUpdateDto.variant_id);
    if (!variant) {
      throw new UnprocessableEntityException({
        variant_id: 'product variant does not exists.',
      });
    }

    const cart = await this.getOrCreateActiveCart(customer);

    let cartItem = await this.cartItemRepository.findOneBy({
      variant_id: itemUpdateDto.variant_id,
      cart_id: cart.id,
    });

    if (!cartItem) {
      cartItem = await this.cartItemRepository.save({
        ...itemUpdateDto,
        cart_id: cart.id,
      });
    } else {
      cartItem.quantity = itemUpdateDto.quantity;
      await cartItem.save();
    }

    return this.getOrCreateActiveCart(customer);
  }

  async emptyActiveCart(customer: Customer) {
    const cart = await this.getOrCreateActiveCart(customer);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    return this.getOrCreateActiveCart(customer);
  }

  async removeItem(cartItem: CartItem, customer: Customer) {
    if (cartItem.cart.customer_id !== customer.id) {
      throw new NotFoundException('cart item not found.');
    }
    await cartItem.remove();
  }
}
