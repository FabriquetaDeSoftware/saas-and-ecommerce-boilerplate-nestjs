import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('key', {
      apiVersion: '2025-01-27.acacia', // Use a versão mais recente da API
    });
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
  ): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Aceita apenas cartão de crédito
      line_items: [
        {
          price_data: {
            currency: currency || 'brl', // Moeda padrão: BRL (Real Brasileiro)
            product_data: {
              name: 'Produto de Teste', // Nome do produto ou serviço
            },
            unit_amount: amount * 100, // Valor em centavos
          },
          quantity: 1, // Quantidade do item
        },
      ],
      mode: 'payment', // Modo de pagamento único
      success_url: 'http://localhost:8080/sucesso', // URL de redirecionamento após sucesso
      cancel_url: 'http://localhost:8080/cancelado', // URL de redirecionamento após cancelamento
    });

    return session.url; // URL do Checkout para redirecionar o usuário
  }
}
