import { Inject, Injectable } from '@nestjs/common';
import { IListManySubscriptionProductUseCase } from '../../domain/interfaces/use_cases/list_many_subscription_products.use_case.interface';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';
import { Products } from '../../domain/entities/products.entity';
import { ListManyProductsDto } from '../dto/list_many_products.dto';
import { ListManyProductsReturn } from '../../domain/interfaces/returns/list_many_products_return.type';

@Injectable()
export class ListManySubscriptionProductUseCase
  implements IListManySubscriptionProductUseCase
{
  @Inject('ISubscriptionProductsRepository')
  private readonly _subscriptionProductsRepository: ISubscriptionProductsRepository;

  public async execute(
    input: ListManyProductsDto,
  ): Promise<ListManyProductsReturn> {
    const response = await this.intermediry(input);

    return response;
  }

  private async intermediry(
    input: ListManyProductsDto,
  ): Promise<ListManyProductsReturn> {
    const response = await this._subscriptionProductsRepository.listMany(
      undefined,
      input.page - 1,
      input.pageSize,
      { id: true },
    );

    return response;
  }
}
