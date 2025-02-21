import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';
import { CreateSubscriptionProductUseCase } from './application/use_cases/create_subscription_product.use_case';
import { SubscriptionProductsRepository } from './infrastructure/repositories/subscription_products.repository';
import { SharedModule } from 'src/shared/shared.module';
import { DeleteProductUseCase } from './application/use_cases/delete_product.use_case';
import { ListManySubscriptionProductUseCase } from './application/use_cases/list_many_subscription_products.use_case';
import { UpdateProductInfoUseCase } from './application/use_cases/update_product_info.use_case';
import { ProductsOrchestrator } from './application/orchestrators/products.orchestrator';
import { CreateSingleProductUseCase } from './application/use_cases/create_single_product.use_case';
import { SingleProductsRepository } from './infrastructure/repositories/single_products.respository';
import { ListManySingleProductUseCase } from './application/use_cases/list_many_single_products.use_case';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ProductsController],
  providers: [
    ListManySingleProductUseCase,
    {
      provide: 'IListManySingleProductUseCase',
      useExisting: ListManySingleProductUseCase,
    },
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
    ProductsOrchestrator,
    {
      provide: 'IProductsOrchestrator',
      useExisting: ProductsOrchestrator,
    },
    UpdateProductInfoUseCase,
    {
      provide: 'IUpdateProductInfoUseCase',
      useExisting: UpdateProductInfoUseCase,
    },
    ListManySubscriptionProductUseCase,
    {
      provide: 'IListManySubscriptionProductUseCase',
      useExisting: ListManySubscriptionProductUseCase,
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
