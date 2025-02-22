import { CreateProductDto } from 'src/modules/products/application/dto/create_product.dto';
import { TypeProductEnum } from '../../enum/type_product.enum';

export interface ICreateProductOrchestrator {
  execute(
    role: string,
    input: CreateProductDto,
    type: TypeProductEnum,
  ): Promise<any>;
}
