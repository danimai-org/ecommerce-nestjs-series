import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secret: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}));
