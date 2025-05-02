import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPurchasesRepository } from '../../domain/interfaces/repositories/subscription_purchases.repository.interface';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { SaveSubscriptionPurchasesProductDto } from '../dto/save_purchases.dto';
import { UserSubscriptionPurchases } from '../../domain/entities/user_purchases.entity';
import { TablesEnum } from 'src/shared/enum/tables.enum';

@Injectable()
export class SubscriptionPurchasesRepository
  implements ISubscriptionPurchasesRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = TablesEnum.USER_SUBSCRIPTION_PURCHASE;

  public async saveSubscriptionPurchaseProductToUser(
    data: SaveSubscriptionPurchasesProductDto,
  ): Promise<Partial<UserSubscriptionPurchases>> {
    const result =
      await this._databaseAdapter.create<UserSubscriptionPurchases>(
        this._model,
        {
          User: {
            connect: { id: data.user_id },
          },
          SubscriptionPurchaseProducts: {
            connect: { id: data.product_id, status: data.status },
          },
        },
      );

    return result;
  }
}
