import { Inject, Injectable } from '@nestjs/common';
import { IOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/one_time_payment.use_case.interface';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';
import { PaymentDto } from '../dto/payment.dto';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { ICryptoUtil } from 'src/shared/utils/interfaces/crypto.util.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';

@Injectable()
export class OneTimePaymentUseCase implements IOneTimePaymentUseCase {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  @Inject('ICryptoUtil')
  private readonly _cryptoUtil: ICryptoUtil;

  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

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
    const [userPublicId, userEmail, priceIdOfProduct] = await Promise.all([
      this.decryptPayload(Buffer.from(user.sub, 'base64')),
      this.decryptPayload(Buffer.from(user.email, 'base64')),
      this.getPriceIdOfProduct(dataOfProduct.public_id),
    ]);

    return this._paymentGatewayAdapter.createOneTimePayment(
      priceIdOfProduct,
      userPublicId,
      userEmail,
      dataOfProduct.public_id,
    );
  }

  private async getPriceIdOfProduct(public_id: string): Promise<string> {
    const getProduct =
      await this._singleProductsRepository.findOneByPublicId(public_id);

    return getProduct.price_id;
  }

  private async decryptPayload(data: Buffer): Promise<string> {
    const dataBuffer = await this._cryptoUtil.decryptData(data);
    const dataBase64 = dataBuffer.toString();

    return dataBase64;
  }
}
