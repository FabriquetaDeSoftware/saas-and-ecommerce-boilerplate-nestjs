import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { TypeProductEnum } from 'src/modules/products/application/enum/type_product.enum';
import { Products } from '../../entities/products.entity';

export interface IProductsOrchestrator {
  create(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<Products>;
}
