import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { PaymentService } from '../payment/payment.service';
import { OrderService } from '../order/order.service';
import { OrderStatus } from 'common/entities/order.entity';
import { PaymentStatus } from 'common/entities/payment.entity';

@Injectable()
export class StripeService {
  client: Stripe;

  constructor(
    private orderService: OrderService,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private configService: ConfigService,
  ) {
    const secretKey = this.configService.get('stripe.secret');
    this.client = new Stripe(secretKey);
  }

  async createPaymentIntent(amount: number) {
    const paymentIntent = await this.client.paymentIntents.create({
      amount,
      currency: 'INR',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  }

  async paymentIntentWebhook(
    event: Stripe.Event,
    headers: Record<string, string>,
  ) {
    const sig = headers['stripe-signature'];
    const webhookSecret = this.configService.get('stripe.webhookSecret');

    try {
      event = this.client.webhooks.constructEvent(
        event as any,
        sig,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (
      ![
        'payment_intent.succeeded',
        'payment_intent.canceled',
        'payment_intent.payment_failed',
      ].includes(event.type)
    ) {
      return;
    }
    const data = event.data.object as Stripe.PaymentIntent;
    const payment = await this.paymentService.getPaymentByTransactionId(
      data.id,
    );
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.orderService.afterPaymentConcluded(
          payment.order,
          OrderStatus.SUCCEEDED,
          payment,
        );
        break;
      case 'payment_intent.canceled':
        payment.status = PaymentStatus.CANCELED;
        await payment.save();
        break;
      case 'payment_intent.payment_failed':
        payment.status = PaymentStatus.FAILED;
        await payment.save();
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  async cancelIntent(id: string) {
    return await this.client.paymentIntents.cancel(id);
  }
}
