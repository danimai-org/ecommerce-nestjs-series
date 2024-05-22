import { Controller, Headers, Post, RawBody } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')
@Controller({
  path: 'stripe',
  version: '1',
})
export class StripeController {
  constructor(private service: StripeService) {}

  @Post('webhooks')
  async getAll(
    @RawBody() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    return this.service.paymentIntentWebhook(body, headers);
  }
}
