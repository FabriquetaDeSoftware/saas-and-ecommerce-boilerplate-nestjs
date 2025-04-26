import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { StatusSubscriptionProductEnum } from 'src/shared/enum/status_subscription_product.enum';

export class SavePurchasesProductDto {
  @IsNotEmpty()
  @IsUUID()
  public_user_id: string;

  @IsNotEmpty()
  @IsUUID()
  public_product_id: string;
}

export class SaveSinglePurchasesProductDto extends SavePurchasesProductDto {}

export class SaveSubscriptionPurchasesProductDto extends SavePurchasesProductDto {
  @IsNotEmpty()
  @IsEnum(StatusSubscriptionProductEnum)
  type: StatusSubscriptionProductEnum;
}
