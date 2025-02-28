import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/subscription_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';

@Injectable()
export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  public async execute(priceId: string): Promise<{ url: string }> {
    return this._paymentGatewayAdapter.createSubscriptionPayment(priceId);
  }
}
