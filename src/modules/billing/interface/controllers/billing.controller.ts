import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  @IsPublicRoute()
  @Post('payment/one-time')
  public async oneTime() {}

  @IsPublicRoute()
  @Post('payment/subscription')
  public async subscription() {}

  @IsPublicRoute()
  @Post('payment/webhook')
  public async webhook() {}
}
