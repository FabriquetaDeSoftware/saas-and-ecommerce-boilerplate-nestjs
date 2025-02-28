import { Inject, Injectable } from '@nestjs/common';
import { IOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/one_time_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';

@Injectable()
export class OneTimePaymentUseCase implements IOneTimePaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  public async execute(priceId: string): Promise<{ url: string }> {
    return this._paymentGatewayAdapter.createOneTimePayment(priceId);
  }
}
