import { Inject, Injectable } from '@nestjs/common';
import { IPaymentGatewayAdapter } from '../../domain/interfaces/gateway/adapters/payment.gateway.adapter.interface';
import { IWebhookService } from '../../domain/interfaces/services/webhook.service.interface';

@Injectable()
export class WebhookService implements IWebhookService {
  @Inject('IPaymentGatewayAdapter')
  private readonly _paymentGatewayAdapter: IPaymentGatewayAdapter;

  public async execute(payload: Buffer<ArrayBufferLike>, signature: string) {
    await this._paymentGatewayAdapter.handleWebhookEvent(payload, signature);
  }
}
