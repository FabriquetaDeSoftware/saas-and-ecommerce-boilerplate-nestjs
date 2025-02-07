import { Inject, Injectable } from '@nestjs/common';
import { ICreateProductUseCase } from '../../domain/interfaces/use_cases/create_product.use_case.interface';
import { CreateProductDto } from '../dto/create_product.dto';
import { Products } from '../../domain/entities/products.entity';
import { IProductsRepository } from '../../domain/interfaces/repositories/products.repository.interface';

@Injectable()
export class CreateProductUseCase implements ICreateProductUseCase {
  @Inject('IProductsRepository')
  private readonly _productsRepository: IProductsRepository;

  public async execute(input: CreateProductDto): Promise<Products> {
    const result = await this._productsRepository.create(input);

    return result;
  }
}
