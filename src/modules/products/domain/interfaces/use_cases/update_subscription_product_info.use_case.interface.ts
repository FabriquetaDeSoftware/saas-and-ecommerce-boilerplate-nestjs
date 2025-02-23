import { UpadateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';
import { Products } from '../../entities/products.entity';

export interface IUpdateSubscriptionProductInfoUseCase {
  execute(input: UpadateProductInfoDto): Promise<Products>;
}
