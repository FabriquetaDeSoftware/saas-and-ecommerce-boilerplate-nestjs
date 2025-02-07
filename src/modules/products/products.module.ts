import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';
import { CreateProductUseCase } from './application/use_cases/create_product.use_case';
import { ProductsRepository } from './infrastructure/repositories/products.repository';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ProductsController],
  providers: [
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
