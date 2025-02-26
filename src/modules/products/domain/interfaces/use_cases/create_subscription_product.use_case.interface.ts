import { Products } from '../../entities/products.entity';
import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';

export interface ICreateSubscriptionProductUseCase {
  execute(role: string, input: CreateProductDto): Promise<Partial<Products>>;
}
