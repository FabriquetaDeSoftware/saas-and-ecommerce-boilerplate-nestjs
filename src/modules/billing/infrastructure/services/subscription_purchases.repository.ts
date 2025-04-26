import { Inject, Injectable } from '@nestjs/common';
import { UserSinglePurchases } from '../../domain/entities/user_purchases.entity';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';
import { ISubscriptionPurchasesService } from '../../domain/interfaces/services/subscription_purchases.service.interface';
import { IUserRepository } from 'src/user/domain/interfaces/repositories/user.repository.interface';
import { ISubscriptionPurchasesRepository } from '../../domain/interfaces/repositories/subscription_purchases.repository.interface';
import { ISubscriptionProductsRepository } from 'src/modules/products/domain/interfaces/repositories/subscription_products.repository.interface';
import { StatusSubscriptionProductEnum } from 'src/shared/enum/status_subscription_product.enum';

@Injectable()
export class SubscriptionPurchasesService
  implements ISubscriptionPurchasesService
{
  @Inject('ISubscriptionPurchasesRepository')
  private readonly _subscriptionPurchasesRepository: ISubscriptionPurchasesRepository;

  @Inject('ISubscriptionProductsRepository')
  private readonly _subscriptionProductsRepository: ISubscriptionProductsRepository;

  @Inject('IUserRepository')
  private readonly _userRepository: IUserRepository;

  public async saveSubscriptionPurchaseProductToUser(
    publicUserId: string,
    publicProductId: string,
  ): Promise<Partial<UserSinglePurchases>> {
    const getProduct =
      await this._subscriptionProductsRepository.findOneByPublicId(
        publicProductId,
      );

    const getUser = await this._userRepository.findOneByPublicId(publicUserId);

    const purchase =
      await this._subscriptionPurchasesRepository.saveSubscriptionPurchaseProductToUser(
        {
          user_id: getUser.id,
          product_id: getProduct.id,
          status: StatusSubscriptionProductEnum.ACTIVE,
        },
      );

    return purchase;
  }
}
