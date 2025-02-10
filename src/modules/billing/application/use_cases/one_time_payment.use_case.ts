import { Inject, Injectable } from '@nestjs/common';
import { IOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/one_time_payment.use_case.interface';
import { IBillingGateway } from '../../domain/interfaces/gateway/billing.gateway.interface';

@Injectable()
export class OneTimePaymentUseCase implements IOneTimePaymentUseCase {
  @Inject('IBillingGateway')
  private readonly _billingGateway: IBillingGateway;

  public async execute(priceId: string): Promise<{ url: string }> {
    return this._billingGateway.createOneTimePayment(priceId);
  }
}
