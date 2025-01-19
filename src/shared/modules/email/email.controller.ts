import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SendEmailQueueJob } from './jobs/send_email_queue.job';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/shared/decorators/is_public_route.decorator';
import { EmailServiceDto } from './dto/email.service.dto';

@ApiTags('email')
@Controller('email')
export class EmailController {
  @Inject()
  private readonly _emailService: SendEmailQueueJob;

  @IsPublicRoute()
  @Post('email-sender')
  public async emailSender(@Body() input: EmailServiceDto): Promise<void> {
    await this._emailService.execute();
  }
}
