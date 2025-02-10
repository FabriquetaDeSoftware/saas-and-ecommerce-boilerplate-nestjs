import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/subscription_payment.use_case.interface';
import { IBillingGateway } from '../../domain/interfaces/gateway/billing.gateway.interface';

@Injectable()
export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  @Inject('IBillingGateway')
  private readonly _billingGateway: IBillingGateway;

  public async execute(priceId: string): Promise<{ url: string }> {
    return this._billingGateway.createSubscriptionPayment(priceId);
  }
}
