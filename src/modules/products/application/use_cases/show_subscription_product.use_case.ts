import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IShowSubscriptionProductUseCase } from '../../domain/interfaces/use_cases/show_subscription_product.use_case.interface';
import { Products } from '../../domain/entities/products.entity';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';

@Injectable()
export class ShowSubscriptionProductUseCase
  implements IShowSubscriptionProductUseCase
{
  @Inject('ISubscriptionProductsRepository')
  private readonly _subscriptionProductsRepository: ISubscriptionProductsRepository;

  public async execute(slug: string): Promise<Partial<Products>> {
    const response = await this.intermediry(slug);

    return response;
  }

  private async intermediry(slug: string): Promise<Partial<Products>> {
    const result = await this._subscriptionProductsRepository.findOneBySlug(
      slug,
      {
        id: true,
      },
    );

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return result;
  }
}
