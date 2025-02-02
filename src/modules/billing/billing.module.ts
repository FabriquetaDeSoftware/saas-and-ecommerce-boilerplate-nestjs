import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';
import { StripePaymentService } from './infrastructure/services/stripe_payment.service';
import { ProcessOneTimePaymentUseCase } from './application/use_cases/process_one_time_payment.use_case';
import { ProcessSubscriptionPaymentUseCase } from './application/use_cases/process_subscription_payment.use_case';

@Module({
  controllers: [BillingController],
  providers: [
    StripePaymentService,
    ProcessSubscriptionPaymentUseCase,
    {
      provide: 'IProcessSubscriptionPaymentUseCase',
      useExisting: ProcessSubscriptionPaymentUseCase,
    },
    ProcessOneTimePaymentUseCase,
    {
      provide: 'IProcessOneTimePaymentUseCase',
      useExisting: ProcessOneTimePaymentUseCase,
    },
  ],
})
export class BillingModule {}
