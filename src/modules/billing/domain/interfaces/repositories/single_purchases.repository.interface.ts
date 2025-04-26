import { SaveSinglePurchasesProductDto } from 'src/modules/billing/infrastructure/dto/save_purchases.dto';
import { UserSinglePurchases } from '../../entities/user_purchases.entity';

export interface ISinglePurchasesRepository {
  saveSinglePurchaseProductToUser(
    data: SaveSinglePurchasesProductDto,
  ): Promise<Partial<UserSinglePurchases>>;
}
