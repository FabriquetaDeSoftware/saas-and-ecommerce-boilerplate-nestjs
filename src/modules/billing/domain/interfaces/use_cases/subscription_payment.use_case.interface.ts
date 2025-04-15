import { PaymentDto } from 'src/modules/billing/application/dto/payment.dto';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';

export interface ISubscriptionPaymentUseCase {
  execute(
    dataOfProduct: PaymentDto,
    user: IJwtUserPayload,
  ): Promise<{ url: string }>;
}
