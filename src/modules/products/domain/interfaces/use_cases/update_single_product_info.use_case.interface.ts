import { UpdateProductInfoDto } from 'src/modules/products/application/dto/update_product_info.dto';
import { Products } from '../../entities/products.entity';

export interface IUpdateSingleProductInfoUseCase {
  execute(
    role: string,
    public_id: string,
    input: UpdateProductInfoDto,
  ): Promise<Partial<Products>>;
}
