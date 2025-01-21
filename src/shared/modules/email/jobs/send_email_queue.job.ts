import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { EmailSenderDto } from '../dto/email_sender.dto';

@Injectable()
export class SendEmailQueueJob
  implements IGenericExecute<EmailSenderDto, { message: string }>
{
  constructor(
    @InjectQueue('SEND_EMAIL_QUEUE') private readonly _sendEmailQueue: Queue,
  ) {}

  private readonly _nameQueue: string = 'SEND_EMAIL_QUEUE';

  async execute(input: EmailSenderDto): Promise<{ message: string }> {
    await this._sendEmailQueue.add(this._nameQueue, input);

    return { message: 'Email sent successfully' };
  }
}
