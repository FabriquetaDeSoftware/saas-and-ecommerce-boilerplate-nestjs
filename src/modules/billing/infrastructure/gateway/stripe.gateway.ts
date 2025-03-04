import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { gatewayConstants } from '../../domain/constants/gateway.constant';

@Injectable()
export class StripeGateway {
  private readonly _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(gatewayConstants.stripe_secret_key, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  public async createOneTimePayment(priceId: string): Promise<{ url: string }> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: gatewayConstants.success_url,
      cancel_url: gatewayConstants.cancel_url,
    });

    return { url: session.url };
  }

  public async createSubscriptionPayment(
    priceId: string,
  ): Promise<{ url: string }> {
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: gatewayConstants.success_url,
      cancel_url: gatewayConstants.cancel_url,
    });

    return { url: session.url };
  }

  public async handleWebhookEvent(
    payload: any,
    signature: string,
  ): Promise<void> {
    const event = this._stripe.webhooks.constructEvent(
      payload,
      signature,
      gatewayConstants.stripe_webhook_secret,
    );

    switch (event.type) {
      case 'charge.succeeded':
        console.log('Charge succeeded');
        break;

      case 'payment_intent.succeeded':
        console.log('Payment intent succeeded');
        break;

      case 'checkout.session.completed':
        console.log('Checkout session completed');
        break;

      case 'payment_intent.created':
        console.log('Payment intent created');
        break;

      case 'charge.updated':
        console.log('Charge updated');
        break;

      case 'payment_method.attached':
        console.log('Payment method attached');
        break;

      case 'customer.created':
        console.log('Customer created');
        break;

      case 'customer.updated':
        console.log('Customer updated');
        break;

      case 'customer.subscription.updated':
        console.log('Customer subscription updated');
        break;

      case 'invoice.finalized':
        console.log('Invoice finalized');
        break;

      case 'invoice.updated':
        console.log('Invoice updated');
        break;

      case 'invoice.paid':
        console.log('Invoice paid');
        break;

      case 'invoice.payment_succeeded':
        console.log('Invoice payment succeeded');
        break;

      case 'customer.subscription.created':
        console.log('Customer subscription created');
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
