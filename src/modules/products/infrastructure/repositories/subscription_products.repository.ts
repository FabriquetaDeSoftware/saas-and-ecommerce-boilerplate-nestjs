import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionProductsRepository } from '../../domain/interfaces/repositories/subscription_products.repository.interface';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { ListManyProductsReturn } from '../../domain/types/list_many_products_return.type';
import { UpdateProductInfoDto } from '../../application/dto/update_product_info.dto';

@Injectable()
export class SubscriptionProductsRepository
  implements ISubscriptionProductsRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'subscriptionPurchaseProducts';

  public async create(data: CreateProductDto): Promise<Products> {
    const result = await this._databaseAdapter.create<Products>(this._model, {
      ...data,
    });

    return result;
  }

  public async delete(public_id: string): Promise<void> {
    await this._databaseAdapter.delete<void>(this._model, { public_id });
  }

  public async listMany(
    where?: object,
    skip?: number,
    take?: number,
  ): Promise<ListManyProductsReturn> {
    const result = await this._databaseAdapter.findMany<Products>(
      this._model,
      { where },
      skip,
      take,
    );

    return result;
  }

  public async findOneByPublicId(public_id: string): Promise<Products> {
    const result = await this._databaseAdapter.findOne<Products>(this._model, {
      public_id,
    });

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneBySlug(slug: string): Promise<Products> {
    const result = await this._databaseAdapter.findOne<Products>(this._model, {
      slug,
    });

    return result;
  }

  public async update(
    public_id: string,
    data: UpdateProductInfoDto,
  ): Promise<Products> {
    const result = await this._databaseAdapter.update<Products>(
      this._model,
      { public_id },
      { ...data },
    );

    return result;
  }
}
