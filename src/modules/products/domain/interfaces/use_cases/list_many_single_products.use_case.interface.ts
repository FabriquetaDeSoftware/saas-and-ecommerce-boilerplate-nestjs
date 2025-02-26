import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ListManyProductsReturn } from '../returns/list_many_products_return.interface';

export interface IListManySingleProductUseCase {
  execute(input: ListManyProductsDto): Promise<ListManyProductsReturn>;
}
