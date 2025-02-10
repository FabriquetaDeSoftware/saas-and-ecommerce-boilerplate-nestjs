import {
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { FastifyRequest } from 'fastify';
import { IPaymentService } from '../../domain/interfaces/services/payment.service.interface';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  @Inject('IPaymentService')
  private readonly _paymentService: IPaymentService;

  @IsPublicRoute()
  @Post('payment/one-time')
  @HttpCode(303)
  public async oneTime(): Promise<{ url: string }> {
    const priceId = 'price_1Qnj8hAIFECoCtHiGReB5Rpl';
    const paymentIntent =
      await this._paymentService.createOneTimePayment(priceId);

    return paymentIntent;
  }

  @IsPublicRoute()
  @Post('payment/subscription')
  @HttpCode(303)
  public async subscription(): Promise<{ url: string }> {
    const priceId = 'price_1QouBMAIFECoCtHid1E2PjEM';
    const paymentIntent =
      await this._paymentService.createSubscriptionPayment(priceId);

    return paymentIntent;
  }

  @IsPublicRoute()
  @Post('webhook')
  public async webhook(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') stripeSignature: string,
  ): Promise<void> {
    const payload = req.rawBody;

    await this._paymentService.handleWebhookEvent(payload, stripeSignature);
  }
}
