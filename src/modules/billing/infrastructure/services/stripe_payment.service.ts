import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51QkqmnAIFECoCtHiqG8glyWO4G85vkgc2FqLWmaQbj8cjSWKolsnx3qn4JoYZM1cs2v0LfYZgxtoioaEtTa8mgy900GFuGjs0w',
      {
        apiVersion: '2025-01-27.acacia',
      },
    );
  }

  async createOneTimePayment(priceId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:8080/api',
      cancel_url: 'http://localhost:8080/',
    });

    return session.url;
  }

  async handleWebhookEvent(payload: any, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      'whsec_856015c16b8f037a85b8878ad31fc09d1a35779606d0704b4dd63153ea9dd30f',
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}
