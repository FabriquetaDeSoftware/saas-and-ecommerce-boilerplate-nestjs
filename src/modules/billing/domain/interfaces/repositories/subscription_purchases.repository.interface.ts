import { SaveSubscriptionPurchasesProductDto } from 'src/modules/billing/infrastructure/dto/save_purchases.dto';

export interface ISubscriptionPurchasesRepository {
  saveSubscriptionPurchaseProductToUser(
    data: SaveSubscriptionPurchasesProductDto,
  ): Promise<{ message: string }>;
}
