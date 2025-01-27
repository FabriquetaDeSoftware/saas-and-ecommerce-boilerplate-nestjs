import { Module } from '@nestjs/common';
import { BillingController } from './interface/controllers/billing.controller';

@Module({
  controllers: [BillingController],
  providers: [],
})
export class BillingModule {}
