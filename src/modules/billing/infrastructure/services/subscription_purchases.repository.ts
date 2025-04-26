import { Inject, Injectable } from '@nestjs/common';
import { UserSinglePurchases } from '../../domain/entities/user_purchases.entity';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { ISubscriptionPurchasesService } from '../../domain/interfaces/services/subscription_purchases.service.interface';

@Injectable()
export class SubscriptionPurchasesService
  implements ISubscriptionPurchasesService
{
  @Inject('ISinglePurchasesRepository')
  private readonly _singlePurchasesRepository: ISinglePurchasesRepository;

  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  public async saveSubscriptionPurchaseProductToUser(
    publicUserId: string,
    publicProductId: string,
  ): Promise<Partial<UserSinglePurchases>> {
    const getProduct =
      await this._singleProductsRepository.findOneByPublicId(publicProductId);

    const purchase =
      await this._singlePurchasesRepository.saveSinglePurchaseProductToUser({
        user_id: userId,
        product_id: getProduct.id,
      });

    return purchase;
  }
}
