import { SaveSubscriptionPurchasesProductDto } from 'src/modules/billing/infrastructure/dto/save_purchases.dto';
import { UserSubscriptionPurchases } from '../../entities/user_purchases.entity';

export interface ISubscriptionPurchasesRepository {
  saveSubscriptionPurchaseProductToUser(
    data: SaveSubscriptionPurchasesProductDto,
  ): Promise<Partial<UserSubscriptionPurchases>>;
}
