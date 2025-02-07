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
}
