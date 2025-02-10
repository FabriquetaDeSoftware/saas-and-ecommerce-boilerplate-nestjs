import { Inject, Injectable } from '@nestjs/common';
import { IBillingGateway } from '../../domain/interfaces/gateway/billing.gateway.interface';
import { IWebhookService } from '../../domain/interfaces/services/webhook.service.interface';

@Injectable()
export class WebhookService implements IWebhookService {
  @Inject('IBillingGateway')
  private readonly _billingGateway: IBillingGateway;

  public async execute(payload: Buffer<ArrayBufferLike>, signature: string) {
    await this._billingGateway.handleWebhookEvent(payload, signature);
  }
}
