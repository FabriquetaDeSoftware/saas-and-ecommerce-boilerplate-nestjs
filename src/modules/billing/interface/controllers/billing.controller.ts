import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { StripePaymentService } from '../../infrastructure/services/stripe_payment.service';
import { PaymentDto } from '../../application/dto/payment.dto';

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
  public async subscription() {}

  @IsPublicRoute()
  @Post('payment/webhook')
  public async webhook(@Req() req, @Res() res) {
    const sig = req.headers['stripe-signature'];
    const payload = req.rawBody;

    console.log('payload', payload);
    console.log('sig', sig);

    try {
      await this.stripeService.handleWebhookEvent(payload, sig);
      res.status(200).send();
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
