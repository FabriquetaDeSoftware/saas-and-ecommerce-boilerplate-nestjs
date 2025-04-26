import { UserSinglePurchases } from '../../entities/user_purchases.entity';

export interface ISinglePurchasesService {
  saveSinglePurchaseProductToUser(
    publicUserId: string,
    publicProductId: string,
  ): Promise<Partial<UserSinglePurchases>>;
}
