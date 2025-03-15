import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Products } from '../../domain/entities/products.entity';
import { IShowSingleProductUseCase } from '../../domain/interfaces/use_cases/show_single_product.use_case.interface';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';

@Injectable()
export class ShowSingleProductUseCase implements IShowSingleProductUseCase {
  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  public async execute(slug: string): Promise<Partial<Products>> {
    const response = await this.intermediry(slug);

    return response;
  }

  private async intermediry(slug: string): Promise<Partial<Products>> {
    const result = await this._singleProductsRepository.findOneBySlug(slug, {
      id: true,
    });

    if (!result) {
      throw new NotFoundException('Product not found');
    }

    return result;
  }
}
