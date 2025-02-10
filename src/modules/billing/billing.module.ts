import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';
import { StripeGateway } from './infrastructure/gateway/stripe.gateway';
import { WebhookService } from './infrastructure/services/webhook.service';
import { OneTimePaymentUseCase } from './application/use_cases/one_time_payment.use_case';
import { SubscriptionPaymentUseCase } from './application/use_cases/subscription_payment.use_case';

@Module({
  controllers: [BillingController],
  providers: [
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
    {
      provide: 'IBillingGateway',
      useExisting: StripeGateway,
    },
  ],
})
export class BillingModule {}
