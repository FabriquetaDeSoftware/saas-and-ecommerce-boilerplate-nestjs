import { Products } from '../../entities/products.entity';

export interface IShowSubscriptionProductUseCase {
  execute(slug: string): Promise<Partial<Products>>;
}
