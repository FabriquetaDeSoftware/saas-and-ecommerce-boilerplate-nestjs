import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentDto } from '../../application/dto/payment.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  @Post('payment')
  public async payment(@Body() input: PaymentDto) {}
}
