import { UserSinglePurchases } from '../../entities/user_purchases.entity';

export interface ISubscriptionPurchasesService {
  saveSubscriptionPurchaseProductToUser(
    publicUserId: string,
    publicProductId: string,
  ): Promise<Partial<UserSinglePurchases>>;
}
