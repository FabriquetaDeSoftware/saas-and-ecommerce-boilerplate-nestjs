import { Products } from '../../entities/products.entity';

export interface IListManyProductUseCase {
  execute(): Promise<Omit<Products, 'id'>[]>;
}
