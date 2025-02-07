import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from '../../entities/products.entity';

export interface IProductsRepository {
  create(input: CreateProductDto): Promise<Products>;
}
