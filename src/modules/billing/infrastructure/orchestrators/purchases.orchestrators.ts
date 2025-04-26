import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPurchasesOrchestrators } from '../../domain/interfaces/orchestrators/purchases.orchestrators.interface';

@Injectable()
export class PurchasesOrchestrators implements IPurchasesOrchestrators {
  public async savePurchaseProductToUser(
    paymentType: string,
    customerId: string,
    productId: string,
  ): Promise<{ message: string }> {
    if (paymentType === 'single') {
      return {
        message: `Single purchase with id: ${productId} saved successfully to user with id: ${customerId}`,
      };
    }

    if (paymentType === 'subscription') {
      return {
        message: `Subscription purchase with id: ${productId} saved successfully to user with id: ${customerId}`,
      };
    }

    throw new BadRequestException(`Invalid payment type: ${paymentType}`);
  }
}
