import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { EmailServiceDto } from '../dto/email.service.dto';

@Injectable()
export class SendEmailQueueJob
  implements IGenericExecute<EmailServiceDto, { message: string }>
{
  constructor(
    @InjectQueue('SEND_EMAIL_QUEUE') private readonly _sendEmailQueue: Queue,
  ) {}

  private readonly _nameQueue: string = 'SEND_EMAIL_QUEUE';

  async execute(input: EmailServiceDto): Promise<{ message: string }> {
    await this._sendEmailQueue.add(this._nameQueue, input);

    return { message: 'Email sent successfully' };
  }
}
