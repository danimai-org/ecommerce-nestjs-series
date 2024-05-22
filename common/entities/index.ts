import { Address } from './address.entity';
import { CustomerSession } from './customer_session.entity';
import { CustomerToken } from './customer_token.entity';
import { Media } from './media.entity';
import { Post } from './post.entity';
import { Product } from './product.entity';
import { ProductVariant } from './product_variant.entity';
import { User } from './user.entity';
import { Session } from './user_session.entity';
import { Token } from './user_token.entity';
import { ProductVariantMedia } from './product_variant_media.entity';
import { Customer } from './customer.entity';
import { CartItem } from './cart_item.entity';
import { Cart } from './cart.entity';
import { Order } from './order.entity';
import { Payment } from './payment.entity';

export const loadEntities = [
  CustomerSession,
  CustomerToken,
  Media,
  Post,
  Session,
  Token,
  User,
  Customer,
  Address,
  Product,
  ProductVariant,
  ProductVariantMedia,
  Cart,
  CartItem,
  Order,
  Payment,
];
