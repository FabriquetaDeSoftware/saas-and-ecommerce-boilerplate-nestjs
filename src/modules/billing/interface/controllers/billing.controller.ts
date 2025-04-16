import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { FastifyRequest } from 'fastify';
import { IWebhookService } from '../../domain/interfaces/services/webhook.service.interface';
import { IOneTimePaymentUseCase } from '../../domain/interfaces/use_cases/one_time_payment.use_case.interface';
import { ISubscriptionPaymentUseCase } from '../../domain/interfaces/use_cases/subscription_payment.use_case.interface';
import { IJwtUserPayload } from 'src/shared/interfaces/jwt_user_payload.interface';
import { CurrentUser } from 'src/common/decorators/current_user.decorator';
import { PaymentDto } from '../../application/dto/payment.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  @Inject('IWebhookService')
  private readonly _webhookService: IWebhookService;

  @Inject('IOneTimePaymentUseCase')
  private readonly _oneTimepaymentService: IOneTimePaymentUseCase;

  @Inject('ISubscriptionPaymentUseCase')
  private readonly _subscriptionPaymentService: ISubscriptionPaymentUseCase;

  @ApiBearerAuth()
  @Post('payment/one-time')
  @HttpCode(303)
  public async oneTime(
    @Body() data: PaymentDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const paymentIntent = await this._oneTimepaymentService.execute(data, user);

    return paymentIntent;
  }

  @ApiBearerAuth()
  @Post('payment/subscription')
  @HttpCode(303)
  public async subscription(
    @Body() data: PaymentDto,
    @CurrentUser() user: IJwtUserPayload,
  ): Promise<{ url: string }> {
    const paymentIntent = await this._subscriptionPaymentService.execute(
      data,
      user,
    );

    return paymentIntent;
  }

  @IsPublicRoute()
  @Post('webhook')
  public async webhook(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') stripeSignature: string,
  ): Promise<void> {
    const payload = req.rawBody;

    await this._webhookService.execute(payload, stripeSignature);

    return;
  }
}
