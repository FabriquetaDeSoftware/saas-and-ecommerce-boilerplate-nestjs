import { Inject, Injectable } from '@nestjs/common';
import { StripeGateway } from '../stripe.gateway';
import { IPaymentGatewayAdapter } from 'src/modules/billing/domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';

@Injectable()
export class PaymentGatewayAdapter implements IPaymentGatewayAdapter {
  @Inject()
  private readonly _stripeGateway: StripeGateway;

  public async createOneTimePayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
  ): Promise<{ url: string }> {
    return this._stripeGateway.createOneTimePayment(
      priceId,
      customerId,
      customerEmail,
    );
  }

  public async createSubscriptionPayment(
    priceId: string,
    customerId: string,
    customerEmail: string,
  ): Promise<{ url: string }> {
    return this._stripeGateway.createSubscriptionPayment(
      priceId,
      customerId,
      customerEmail,
    );
  }

  public async handleWebhookEvent(
    payload: Buffer<ArrayBufferLike>,
    signature: string,
  ): Promise<void> {
    return this._stripeGateway.handleWebhookEvent(payload, signature);
  }
}
