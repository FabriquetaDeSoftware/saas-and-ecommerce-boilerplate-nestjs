import { Inject, Injectable } from '@nestjs/common';
import { UserSinglePurchases } from '../../domain/entities/user_purchases.entity';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { ISubscriptionPurchasesService } from '../../domain/interfaces/services/subscription_purchases.service.interface';
import { IUserRepository } from 'src/user/domain/interfaces/repositories/user.repository.interface';

@Injectable()
export class SubscriptionPurchasesService
  implements ISubscriptionPurchasesService
{
  @Inject('ISinglePurchasesRepository')
  private readonly _singlePurchasesRepository: ISinglePurchasesRepository;

  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  @Inject('IUserRepository')
  private readonly _userRepository: IUserRepository;

  public async saveSubscriptionPurchaseProductToUser(
    publicUserId: string,
    publicProductId: string,
  ): Promise<Partial<UserSinglePurchases>> {
    const getProduct =
      await this._singleProductsRepository.findOneByPublicId(publicProductId);

    const getUser = await this._userRepository.findOneByPublicId(publicUserId);

    const purchase =
      await this._singlePurchasesRepository.saveSinglePurchaseProductToUser({
        user_id: getUser.id,
        product_id: getProduct.id,
      });

    return purchase;
  }
}
