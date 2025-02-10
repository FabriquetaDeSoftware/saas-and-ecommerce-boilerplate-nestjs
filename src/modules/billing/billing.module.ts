import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';
import { StripeGateway } from './infrastructure/gateway/stripe.gateway';
import { WebhookService } from './infrastructure/services/webhook.service';

@Module({
  controllers: [BillingController],
  providers: [
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
