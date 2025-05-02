import { Inject, Injectable } from '@nestjs/common';
import { ISinglePurchasesRepository } from '../../domain/interfaces/repositories/single_purchases.repository.interface';
import { SaveSinglePurchasesProductDto } from '../dto/save_purchases.dto';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { UserSinglePurchases } from '../../domain/entities/user_purchases.entity';
import { TablesEnum } from 'src/shared/enum/tables.enum';

@Injectable()
export class SinglePurchasesRepository implements ISinglePurchasesRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = TablesEnum.USER_SINGLE_PURCHASE;

  public async saveSinglePurchaseProductToUser(
    data: SaveSinglePurchasesProductDto,
  ): Promise<Partial<UserSinglePurchases>> {
    const result = await this._databaseAdapter.create<UserSinglePurchases>(
      this._model,
      {
        User: {
          connect: { id: data.user_id },
        },
        SinglePurchaseProducts: {
          connect: { id: data.product_id },
        },
      },
    );

    return result;
  }
}
