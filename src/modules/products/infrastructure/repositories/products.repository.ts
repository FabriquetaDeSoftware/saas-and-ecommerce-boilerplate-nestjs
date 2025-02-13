import { Inject, Injectable } from '@nestjs/common';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { CreateProductDto } from '../../application/dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'products';

  public async create(createProductDto: CreateProductDto): Promise<Products> {
    const result = await this._databaseAdapter.create<Products>(this._model, {
      ...createProductDto,
    });

    return result;
  }

  public async delete(public_id: string): Promise<void> {
    await this._databaseAdapter.delete<void>(this._model, { public_id });
  }

  public async listMany(): Promise<Products[]> {
    const result = await this._databaseAdapter.findMany<Products>(this._model);

    return result;
  }

  public async findOneByPublicId(public_id: string): Promise<Products> {
    const result = await this._databaseAdapter.findOne<Products>(this._model, {
      public_id,
    });

    return result;
  }
}
