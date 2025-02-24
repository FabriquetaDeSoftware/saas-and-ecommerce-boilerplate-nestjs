import { Injectable } from '@nestjs/common';
import { IUpdateSubscriptionProductInfoUseCase } from '../../domain/interfaces/use_cases/update_subscription_product_info.use_case.interface';
import { UpadateProductInfoDto } from '../dto/update_product_info.dto';
import { Products } from '../../domain/entities/products.entity';

@Injectable()
export class UpdateSubscriptionProductInfoUseCase
  implements IUpdateSubscriptionProductInfoUseCase
{
  public async execute(
    role: string,
    public_id: string,
    input: UpadateProductInfoDto,
  ): Promise<Products> {
    return;
  }
}
