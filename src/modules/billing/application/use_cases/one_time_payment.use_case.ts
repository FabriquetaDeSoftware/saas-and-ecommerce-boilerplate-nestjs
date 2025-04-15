import { Inject, Injectable } from '@nestjs/common';
import { IOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/one_time_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';
import { PaymentDto } from '../dto/payment.dto';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';

@Injectable()
export class OneTimePaymentUseCase implements IOneTimePaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  public async execute(
    dataOfProduct: PaymentDto,
    user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const priceId: string = '';
    return this._paymentGatewayAdapter.createOneTimePayment(priceId);
  }
}
