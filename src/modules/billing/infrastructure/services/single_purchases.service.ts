import { Inject, Injectable } from '@nestjs/common';
import { ISinglePurchasesService } from '../../domain/interfaces/services/single_purchases.service.interface';
import { UserSinglePurchases } from '../../domain/entities/user_purchases.entity';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';
import { ISingleProductsRepository } from 'src/modules/products/domain/interfaces/repositories/single_products.repository.interface';

@Injectable()
export class SinglePurchasesService implements ISinglePurchasesService {
  @Inject('ISinglePurchasesRepository')
  private readonly _singlePurchasesRepository: ISinglePurchasesRepository;

  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  public async saveSinglePurchaseProductToUser(
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
