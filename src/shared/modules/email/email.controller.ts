import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublicRoute } from 'src/common/decorators/is_public_route.decorator';
import { EmailSenderDto } from './application/dto/email_sender.dto';
import { ISendEmailQueueJob } from './interfaces/jobs/send_email_queue.job.interface';

@ApiTags('email')
@Controller('email')
export class EmailController {
  @Inject('ISendEmailQueueJob')
  private readonly _sendEmailQueueJob: ISendEmailQueueJob;

  @IsPublicRoute()
  @Post('email-sender')
  public async emailSender(
    @Body() input: EmailSenderDto,
  ): Promise<{ message: string }> {
    return await this._sendEmailQueueJob.execute(input);
  }
}
