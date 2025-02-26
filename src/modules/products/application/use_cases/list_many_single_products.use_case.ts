import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';
import { Products } from '../../domain/entities/products.entity';
import { ListManyProductsDto } from '../dto/list_many_products.dto';
import { ListManyProductsReturn } from '../../domain/interfaces/returns/list_many_products_return.type';
import { IListManySingleProductUseCase } from '../../domain/interfaces/use_cases/list_many_single_products.use_case.interface';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';

@Injectable()
export class ListManySingleProductUseCase
  implements IListManySingleProductUseCase
{
  @Inject('ISingleProductsRepository')
  private readonly _singleProductsRepository: ISingleProductsRepository;

  public async execute(
    input: ListManyProductsDto,
  ): Promise<ListManyProductsReturn> {
    const response = await this.intermediry(input);

    return response;
  }

  private async intermediry(
    input: ListManyProductsDto,
  ): Promise<ListManyProductsReturn> {
    const response = await this._singleProductsRepository.listMany(
      undefined,
      input.page - 1,
      input.pageSize,
      { id: true },
    );

    return response;
  }
}
