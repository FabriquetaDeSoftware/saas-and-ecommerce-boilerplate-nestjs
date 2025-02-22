import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ListManyProductsWithoutIdReturn } from '../../types/list_many_products_return.type';

export interface IListManySingleProductUseCase {
  execute(input: ListManyProductsDto): Promise<ListManyProductsWithoutIdReturn>;
}
