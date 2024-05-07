import { Address } from './address.entity';
import { CustomerSession } from './customer_session.entity';
import { CustomerToken } from './customer_token.entity';
import { Media } from './media.entity';
import { Post } from './post.entity';
import { User } from './user.entity';
import { Session } from './user_session.entity';
import { Token } from './user_token.entity';

export const loadEntities = [
  CustomerSession,
  CustomerToken,
  Media,
  Post,
  Session,
  Token,
  User,
  Address,
];
