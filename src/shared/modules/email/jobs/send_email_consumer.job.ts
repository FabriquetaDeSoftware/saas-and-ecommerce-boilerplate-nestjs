import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from '../email.service';

@Processor('SEND_EMAIL_QUEUE')
export class SendEmailConsumerJob extends WorkerHost {
  @Inject()
  private readonly _emailService: EmailService;

  public async process(job: Job, token?: string): Promise<any> {
    await this._emailService.sendEmail(job.data);
    console.log('Email sent');
  }
}
