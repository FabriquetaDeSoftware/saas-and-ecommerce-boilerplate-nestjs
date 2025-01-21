import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailSenderDto } from '../dto/email_sender.dto';
import { IEmailSenderUseCase } from '../interfaces/use_cases/email_sender.use_case.interface';

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerJob extends WorkerHost {
  @Inject('IEmailSenderUseCase')
  private readonly _emailService: IEmailSenderUseCase;

  public async process(job: Job<EmailSenderDto>): Promise<void> {
    await this._emailService.execute(job.data);

    return;
  }
}
