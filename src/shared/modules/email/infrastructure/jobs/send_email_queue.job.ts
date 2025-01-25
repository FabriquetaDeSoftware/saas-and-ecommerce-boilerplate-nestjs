import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmailSenderDto } from '../../application/dto/email_sender.dto';
import { ISendEmailQueueJob } from '../../domain/interfaces/jobs/send_email_queue.job.interface';

@Injectable()
export class SendEmailQueueJob implements ISendEmailQueueJob {
  constructor(
    @InjectQueue('SEND_EMAIL_QUEUE') private readonly _sendEmailQueue: Queue,
  ) {}

  private readonly _nameQueue: string = 'SEND_EMAIL_QUEUE';

  public async execute(input: EmailSenderDto): Promise<{ message: string }> {
    await this._sendEmailQueue.add(this._nameQueue, input);

    return { message: 'Email sent successfully' };
  }
}
