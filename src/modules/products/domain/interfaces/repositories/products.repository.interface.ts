import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { Products } from '../../entities/products.entity';

export interface IProductsRepository {
  create(input: CreateProductDto): Promise<Products>;
  delete(publicId: string): Promise<void>;
  listMany(): Promise<Products[]>;
  findOneByPublicId(publicId: string): Promise<Products>;
}
