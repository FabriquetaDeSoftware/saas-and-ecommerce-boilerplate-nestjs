import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/subscription_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { PaymentDto } from '../dto/payment.dto';

@Injectable()
export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  public async execute(
    dataOfProduct: PaymentDto,
    user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const priceId: string = '';
    return this._paymentGatewayAdapter.createSubscriptionPayment(priceId);
  }
}
