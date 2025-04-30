import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';
import { StripeGateway } from './infrastructure/gateway/stripe.gateway';
import { WebhookService } from './infrastructure/services/webhook.service';
import { OneTimePaymentUseCase } from './application/use_cases/one_time_payment.use_case';
import { SubscriptionPaymentUseCase } from './application/use_cases/subscription_payment.use_case';
import { PaymentGatewayAdapter } from './infrastructure/gateway/adapters/payment.gateway.adapter';
import { SharedModule } from 'src/shared/shared.module';
import { CommonModule } from 'src/common/common.module';
import { SinglePurchasesRepository } from './infrastructure/repositories/single_purchases.repository';
import { SubscriptionPurchasesRepository } from './infrastructure/repositories/subscription_purchases.repository';
import { PurchasesOrchestrators } from './infrastructure/orchestrators/purchases.orchestrators';
import { ProductsModule } from '../products/products.module';
import { SinglePurchasesService } from './infrastructure/services/single_purchases.service';
import { SubscriptionPurchasesService } from './infrastructure/services/subscription_purchases.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SharedModule, CommonModule, ProductsModule, UserModule],
  controllers: [BillingController],
  providers: [
    SinglePurchasesService,
    {
      provide: 'ISinglePurchasesService',
      useExisting: SinglePurchasesService,
    },
    SubscriptionPurchasesService,
    {
      provide: 'ISubscriptionPurchasesService',
      useExisting: SubscriptionPurchasesService,
    },
    PurchasesOrchestrators,
    {
      provide: 'IPurchasesOrchestrators',
      useExisting: PurchasesOrchestrators,
    },
    SubscriptionPurchasesRepository,
    {
      provide: 'ISubscriptionPurchasesRepository',
      useExisting: SubscriptionPurchasesRepository,
    },
    SinglePurchasesRepository,
    {
      provide: 'ISinglePurchasesRepository',
      useExisting: SinglePurchasesRepository,
    },
    PaymentGatewayAdapter,
    {
      provide: 'IPaymentGatewayAdapter',
      useExisting: PaymentGatewayAdapter,
    },
    SubscriptionPaymentUseCase,
    {
      provide: 'ISubscriptionPaymentUseCase',
      useExisting: SubscriptionPaymentUseCase,
    },
    OneTimePaymentUseCase,
    {
      provide: 'IOneTimePaymentUseCase',
      useExisting: OneTimePaymentUseCase,
    },
    WebhookService,
    {
      provide: 'IWebhookService',
      useExisting: WebhookService,
    },
    StripeGateway,
  ],
})
export class BillingModule {}
