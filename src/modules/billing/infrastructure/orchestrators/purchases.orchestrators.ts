import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPurchasesOrchestrators } from '../../domain/interfaces/orchestrators/purchases.orchestrators.interface';
import { ISinglePurchasesService } from '../../domain/interfaces/services/single_purchases.service.interface';
import { ISubscriptionPurchasesService } from '../../domain/interfaces/services/subscription_purchases.service.interface';

@Injectable()
export class PurchasesOrchestrators implements IPurchasesOrchestrators {
  @Inject('ISinglePurchasesService')
  private readonly _singlePurchasesService: ISinglePurchasesService;

  @Inject('ISubscriptionPurchasesService')
  private readonly _subscriptionPurchasesService: ISubscriptionPurchasesService;

  public async savePurchaseProductToUser(
    paymentType: string,
    customerId: string,
    productId: string,
  ): Promise<{ message: string }> {
    if (paymentType === 'single') {
      await this._singlePurchasesService.saveSinglePurchaseProductToUser(
        customerId,
        productId,
      );

      return {
        message: `Single purchase with id: ${productId} saved successfully to user with id: ${customerId}`,
      };
    }

    if (paymentType === 'subscription') {
      await this._subscriptionPurchasesService.saveSubscriptionPurchaseProductToUser(
        customerId,
        productId,
      );

      return {
        message: `Subscription purchase with id: ${productId} saved successfully to user with id: ${customerId}`,
      };
    }

    throw new BadRequestException(`Invalid payment type: ${paymentType}`);
  }
}
