import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailSenderDto } from '../../application/dto/email_sender.dto';
import { IEmailSenderService } from '../../domain/interfaces/services/email_sender.service.interface';

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerJob extends WorkerHost {
  @Inject('IEmailSenderService')
  private readonly _emailService: IEmailSenderService;

  public async process(job: Job<EmailSenderDto>): Promise<void> {
    await this._emailService.execute(job.data);

    return;
  }
}
