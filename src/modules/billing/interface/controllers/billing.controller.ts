import { Controller, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { StripePaymentService } from '../../infrastructure/services/stripe_payment.service';
import { FastifyRequest } from 'fastify';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly stripeService: StripePaymentService) {}

  @IsPublicRoute()
  @Post('payment/one-time')
  public async oneTime() {
    const priceId = 'price_1Qnj8hAIFECoCtHiGReB5Rpl';
    const paymentIntent =
      await this.stripeService.createOneTimePayment(priceId);
    return paymentIntent;
  }

  @IsPublicRoute()
  @Post('payment/subscription')
  public async subscription() {
    const priceId = 'price_1QouBMAIFECoCtHid1E2PjEM';
    const paymentIntent =
      await this.stripeService.createSubscriptionPayment(priceId);

    return paymentIntent;
  }

  @IsPublicRoute()
  @Post('webhook')
  public async webhook(@Req() req: RawBodyRequest<FastifyRequest>) {
    const sig = Array.isArray(req.headers['stripe-signature'])
      ? req.headers['stripe-signature'][0]
      : req.headers['stripe-signature'];
    const payload = req.rawBody;

    await this.stripeService.handleWebhookEvent(payload, sig);
  }
}
