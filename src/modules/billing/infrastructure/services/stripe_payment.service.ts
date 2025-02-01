import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('key', {
      apiVersion: '2025-01-27.acacia',
    });
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
  ): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'brl',
            product_data: {
              name: 'Produto de Teste',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:8080/sucesso',
      cancel_url: 'http://localhost:8080/cancelado',
    });

    return session.url;
  }
}
