import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/subscription_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { PaymentDto } from '../dto/payment.dto';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';

@Injectable()
export class SubscriptionPaymentUseCase implements ISubscriptionPaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  public async execute(
    dataOfProduct: PaymentDto,
    user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const result = await this.intemediary(dataOfProduct, user);

    return result;
  }

  private async intemediary(
    dataOfProduct: PaymentDto,
    user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const [userPublicId, userEmail] = await Promise.all([
      this.decryptPayload(Buffer.from(user.sub, 'base64')),
      this.decryptPayload(Buffer.from(user.email, 'base64')),
    ]);

    return this._paymentGatewayAdapter.createSubscriptionPayment(
      'price_1QouBMAIFECoCtHid1E2PjEM',
      userPublicId,
      userEmail,
      dataOfProduct.public_id,
    );
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
