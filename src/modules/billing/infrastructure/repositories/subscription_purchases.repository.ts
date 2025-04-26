import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionPurchasesRepository } from '../../domain/interfaces/repositories/subscription_purchases.repository.interface';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { SaveSubscriptionPurchasesProductDto } from '../dto/save_purchases.dto';
import { UserSubscriptionPurchases } from '../../domain/entities/user_purchases.entity';

@Injectable()
export class SubscriptionPurchasesRepository
  implements ISubscriptionPurchasesRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'userSubscriptionPurchases';

  public async saveSubscriptionPurchaseProductToUser(
    data: SaveSubscriptionPurchasesProductDto,
  ): Promise<Partial<UserSubscriptionPurchases>> {
    const result =
      await this._databaseAdapter.create<UserSubscriptionPurchases>(
        this._model,
        {
          Auth: {
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
