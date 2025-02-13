import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';
import { CreateProductUseCase } from './application/use_cases/create_product.use_case';
import { ProductsRepository } from './infrastructure/repositories/products.repository';
import { SharedModule } from 'src/shared/shared.module';
import { DeleteProductUseCase } from './application/use_cases/delete_product.use_case';
import { ListManyProductUseCase } from './application/use_cases/list_many_products.use_case';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ProductsController],
  providers: [
    ListManyProductUseCase,
    {
      provide: 'IListManyProductUseCase',
      useExisting: ListManyProductUseCase,
    },
    DeleteProductUseCase,
    {
      provide: 'IDeleteProductUseCase',
      useExisting: DeleteProductUseCase,
    },
    ProductsRepository,
    {
      provide: 'IProductsRepository',
      useExisting: ProductsRepository,
    },
    CreateProductUseCase,
    {
      provide: 'ICreateProductUseCase',
      useExisting: CreateProductUseCase,
    },
  ],
})
export class ProductsModule {}
