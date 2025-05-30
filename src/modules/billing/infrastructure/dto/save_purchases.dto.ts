import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { StatusSubscriptionProductEnum } from 'src/shared/enum/status_subscription_product.enum';

export class SavePurchasesProductDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  product_id: number;
}

export class SaveSinglePurchasesProductDto extends SavePurchasesProductDto {}

export class SaveSubscriptionPurchasesProductDto extends SavePurchasesProductDto {
  @IsNotEmpty()
  @IsEnum(StatusSubscriptionProductEnum)
  status: StatusSubscriptionProductEnum;
}
