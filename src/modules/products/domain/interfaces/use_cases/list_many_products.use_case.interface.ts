import { ListManyProductsDto } from 'src/modules/products/application/dto/list_many_products.dto';
import { ListManyProductsReturn } from '../../types/list_many_products_return.type';

export interface IListManyProductUseCase {
  execute(input: ListManyProductsDto): Promise<ListManyProductsReturn>;
}
