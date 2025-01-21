import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { EmailSenderDto } from '../dto/email_sender.dto';

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerJob extends WorkerHost {
  @Inject('IEmailSenderUseCase')
  private readonly _emailService: IGenericExecute<EmailSenderDto, void>;

  public async process(job: Job<EmailSenderDto>): Promise<void> {
    await this._emailService.execute(job.data);

    return;
  }
}
