import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { stripeConstants } from '../../domain/constants/stripe.constant';
import { IBillingGateway } from '../../domain/interfaces/gateway/billing.gateway.interface';

@Injectable()
export class StripeGateway implements IBillingGateway {
  private readonly _stripe: Stripe;

  constructor() {
    this._stripe = new Stripe(stripeConstants.stripe_secret_key, {
      apiVersion: '2025-01-27.acacia',
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
      success_url: stripeConstants.success_url,
      cancel_url: stripeConstants.cancel_url,
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
      success_url: stripeConstants.success_url,
      cancel_url: stripeConstants.cancel_url,
    });

    return { url: session.url };
  }

  public async handleWebhookEvent(payload: any, signature: string) {
    const event = this._stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConstants.stripe_webhook_secret,
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
