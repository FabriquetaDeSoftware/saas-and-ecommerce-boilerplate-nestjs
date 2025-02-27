import { Module } from '@nestjs/common';
import { ProductsController } from './interface/controllers/products.controller';
import { CommonModule } from 'src/common/common.module';
import { CreateSubscriptionProductUseCase } from './application/use_cases/create_subscription_product.use_case';
import { SubscriptionProductsRepository } from './infrastructure/repositories/subscription_products.repository';
import { SharedModule } from 'src/shared/shared.module';
import { DeleteSubscriptionProductUseCase } from './application/use_cases/delete_subscription_product.use_case';
import { ListManySubscriptionProductUseCase } from './application/use_cases/list_many_subscription_products.use_case';
import { UpdateSubscriptionProductInfoUseCase } from './application/use_cases/update_subscription_product_info.use_case';
import { ProductsOrchestrator } from './application/orchestrators/products.orchestrator';
import { CreateSingleProductUseCase } from './application/use_cases/create_single_product.use_case';
import { SingleProductsRepository } from './infrastructure/repositories/single_products.respository';
import { ListManySingleProductUseCase } from './application/use_cases/list_many_single_products.use_case';
import { DeleteSingleProductUseCase } from './application/use_cases/delete_single_product.use_case';
import { UpdateSingleProductInfoUseCase } from './application/use_cases/update_single_product_info.use_case';
import { ShowSubscriptionProductUseCase } from './application/use_cases/show_subscription_product.use_case';
import { ShowSingleProductUseCase } from './application/use_cases/show_single_product.use_case';

@Module({
  imports: [CommonModule, SharedModule],
  controllers: [ProductsController],
  providers: [
    ShowSingleProductUseCase,
    {
      provide: 'IShowSingleProductUseCase',
      useExisting: ShowSingleProductUseCase,
    },
    ShowSubscriptionProductUseCase,
    {
      provide: 'IShowSubscriptionProductUseCase',
      useExisting: ShowSubscriptionProductUseCase,
    },
    DeleteSingleProductUseCase,
    {
      provide: 'IDeleteSingleProductUseCase',
      useExisting: DeleteSingleProductUseCase,
    },
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
    UpdateSingleProductInfoUseCase,
    {
      provide: 'IUpdateSingleProductInfoUseCase',
      useExisting: UpdateSingleProductInfoUseCase,
    },
    UpdateSubscriptionProductInfoUseCase,
    {
      provide: 'IUpdateSubscriptionProductInfoUseCase',
      useExisting: UpdateSubscriptionProductInfoUseCase,
    },
    ListManySubscriptionProductUseCase,
    {
      provide: 'IListManySubscriptionProductUseCase',
      useExisting: ListManySubscriptionProductUseCase,
    },
    DeleteSubscriptionProductUseCase,
    {
      provide: 'IDeleteSubscriptionProductUseCase',
      useExisting: DeleteSubscriptionProductUseCase,
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
