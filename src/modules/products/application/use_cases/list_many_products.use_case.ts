import { Inject, Injectable } from '@nestjs/common';
import { IListManyProductUseCase } from '../../domain/interfaces/use_cases/list_many_products.use_case.interface';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { Products } from '../../domain/entities/products.entity';
import { ListManyProductsDto } from '../dto/list_many_products.dto';
import { ListManyProductsWithoutIdReturn } from '../../domain/types/list_many_products_return.type';

@Injectable()
export class ListManyProductUseCase implements IListManyProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  public async execute(
    input: ListManyProductsDto,
  ): Promise<ListManyProductsWithoutIdReturn> {
    const response = await this._productsRepository.listManyWithPagination(
      undefined,
      input.page - 1,
      input.pageSize,
    );

    const withoutId = this.intermediry(response.data);

    return { ...response, data: withoutId };
  }

  private intermediry(list: Products[]): Omit<Products, 'id'>[] {
    return this.removeIdFromProduct(list);
  }

  private removeIdFromProduct(products: Products[]): Omit<Products, 'id'>[] {
    const result = products.map(({ id, ...rest }) => rest);

    return result;
  }
}
