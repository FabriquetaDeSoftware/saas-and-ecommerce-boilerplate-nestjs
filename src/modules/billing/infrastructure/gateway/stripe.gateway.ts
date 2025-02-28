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

  public async createOneTimePayment(priceId: string) {
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

  public async createSubscriptionPayment(priceId: string) {
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

  public async handleWebhookEvent(payload: any, signature: string) {
    const event = this._stripe.webhooks.constructEvent(
      payload,
      signature,
      gatewayConstants.stripe_webhook_secret,
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
