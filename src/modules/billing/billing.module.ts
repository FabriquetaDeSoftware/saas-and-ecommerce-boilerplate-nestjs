import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';
import { StripePaymentService } from './infrastructure/services/stripe_payment.service';

@Module({
  controllers: [BillingController],
  providers: [StripePaymentService],
})
export class BillingModule {}
