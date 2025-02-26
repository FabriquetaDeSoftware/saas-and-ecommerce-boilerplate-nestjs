import { Inject, Injectable } from '@nestjs/common';
import { ISingleProductsRepository } from '../../domain/interfaces/repositories/single_products.repository.interface';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { ListManyProductsReturn } from '../../domain/interfaces/returns/list_many_products_return.interface';
import { UpdateProductInfoDto } from '../../application/dto/update_product_info.dto';

@Injectable()
export class SingleProductsRepository implements ISingleProductsRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'singlePurchaseProducts';

  public async create(
    data: CreateProductDto,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>> {
    const result = await this._databaseAdapter.create<Products>(
      this._model,
      {
        ...data,
      },
      { ...omitFields },
    );

    return result;
  }

  public async delete(public_id: string): Promise<void> {
    await this._databaseAdapter.delete(this._model, { public_id });

    return;
  }

  public async listMany(
    where?: object,
    skip?: number,
    take?: number,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<ListManyProductsReturn> {
    const result = await this._databaseAdapter.findMany<Products>(
      this._model,
      { where },
      skip,
      take,
      { ...omitFields },
    );

    return result;
  }

  public async findOneByPublicId(
    public_id: string,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>> {
    const result = await this._databaseAdapter.findOne<Products>(
      this._model,
      {
        public_id,
      },
      { ...omitFields },
    );

    if (!result) {
      return null;
    }

    return result;
  }

  public async findOneBySlug(
    slug: string,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>> {
    const result = await this._databaseAdapter.findOne<Products>(
      this._model,
      {
        slug,
      },
      { ...omitFields },
    );

    return result;
  }

  public async update(
    public_id: string,
    data: UpdateProductInfoDto,
    omitFields?: Partial<Record<keyof Products, true>>,
  ): Promise<Partial<Products>> {
    const result = await this._databaseAdapter.update<Products>(
      this._model,
      { public_id },
      { ...data },
      { ...omitFields },
    );

    return result;
  }
}
