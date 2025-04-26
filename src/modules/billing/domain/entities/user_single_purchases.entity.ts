import { StatusSubscriptionProductEnum } from 'src/shared/enum/status_subscription_product.enum';

export class UserSinglePurchases {
  authId: string;
  singlePurchaseProductsId: string;
  status: StatusSubscriptionProductEnum;
}
