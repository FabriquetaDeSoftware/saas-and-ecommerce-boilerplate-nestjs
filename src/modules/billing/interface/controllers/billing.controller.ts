import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentDto } from '../../application/dto/payment.dto';
import { StripePaymentService } from '../../infrastructure/services/stripe_payment.service';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly stripePaymentService: StripePaymentService) {}

  @IsPublicRoute()
  @Post('payment/credit-card')
  public async creditCardPayment(@Body() input: PaymentDto) {
    const { amount, currency } = input;
    const checkoutUrl = await this.stripePaymentService.createCheckoutSession(
      amount,
      currency,
    );

    return { url: checkoutUrl };
  }
}
