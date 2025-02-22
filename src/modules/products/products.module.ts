import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';
import { CreateSubscriptionProductUseCase } from './application/use_cases/create_subscription_product.use_case';
import { SubscriptionProductsRepository } from './infrastructure/repositories/subscription_products.repository';
import { SharedModule } from 'src/shared/shared.module';
import { DeleteProductUseCase } from './application/use_cases/delete_product.use_case';
import { ListManyProductUseCase } from './application/use_cases/list_many_products.use_case';
import { UpdateProductInfoUseCase } from './application/use_cases/update_product_info.use_case';
import { CreateProductOrchestrator } from './application/orchestrators/create_product.orchestrator';
import { CreateSingleProductUseCase } from './application/use_cases/create_single_product.use_case';
import { SingleProductsRepository } from './infrastructure/repositories/single_products.respository';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ProductsController],
  providers: [
    SingleProductsRepository,
    {
      provide: 'ISingleProductsRepository',
      useExisting: SingleProductsRepository,
    },
    CreateSingleProductUseCase,
    {
      provide: 'ICreateSingleProductUseCase',
      useExisting: CreateSingleProductUseCase,
    },
    CreateProductOrchestrator,
    {
      provide: 'ICreateProductOrchestrator',
      useExisting: CreateProductOrchestrator,
    },
    UpdateProductInfoUseCase,
    {
      provide: 'IUpdateProductInfoUseCase',
      useExisting: UpdateProductInfoUseCase,
    },
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
    SubscriptionProductsRepository,
    {
      provide: 'ISubscriptionProductsRepository',
      useExisting: SubscriptionProductsRepository,
    },
    CreateSubscriptionProductUseCase,
    {
      provide: 'ICreateSubscriptionProductUseCase',
      useExisting: CreateSubscriptionProductUseCase,
    },
  ],
})
export class ProductsModule {}
