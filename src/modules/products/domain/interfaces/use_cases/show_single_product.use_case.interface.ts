import { Products } from '../../entities/products.entity';

export interface IShowSingleProductUseCase {
  execute(slug: string): Promise<Partial<Products>>;
}
