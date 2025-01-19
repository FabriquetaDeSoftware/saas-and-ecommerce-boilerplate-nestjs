import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SendEmailQueueJob {
  private readonly _nameQueue: string = 'SEND_EMAIL_QUEUE';

  constructor(
    @InjectQueue('SEND_EMAIL_QUEUE') private readonly _sendEmailQueue: Queue,
  ) {}

  async execute(): Promise<void> {
    await this._sendEmailQueue.add(this._nameQueue, {});
  }
}
