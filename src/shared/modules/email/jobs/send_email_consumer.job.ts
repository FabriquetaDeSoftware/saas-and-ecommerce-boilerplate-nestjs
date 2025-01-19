import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { EmailServiceDto } from '../dto/email.service.dto';

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerJob extends WorkerHost {
  @Inject('IEmailService')
  private readonly _emailService: IGenericExecute<EmailServiceDto, void>;

  public async process(job: Job<EmailServiceDto>): Promise<void> {
    await this._emailService.execute(job.data);

    return;
  }
}
