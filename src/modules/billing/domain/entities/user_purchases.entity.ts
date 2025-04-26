import { StatusSubscriptionProductEnum } from 'src/shared/enum/status_subscription_product.enum';

export class UserPurchases {
  authPublicId: number;
  singlePurchaseProductsId: number;
}

export class UserSinglePurchases extends UserPurchases {}

export class UserSubscriptionPurchases extends UserPurchases {
  status: StatusSubscriptionProductEnum;
}
