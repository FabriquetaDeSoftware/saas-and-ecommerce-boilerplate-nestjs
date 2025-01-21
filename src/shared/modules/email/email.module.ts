import { Module } from '@nestjs/common';
import { EmailSender } from './email.service';
import { EmailController } from './email.controller';
import { SendEmailQueueJob } from './jobs/send_email_queue.job';
import { SendEmailConsumerJob } from './jobs/send_email_consumer.job';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' })],
  controllers: [EmailController],
  providers: [
    SendEmailConsumerJob,
    EmailSender,
    {
      provide: 'IEmailSender',
      useExisting: EmailSender,
    },
    SendEmailQueueJob,
    {
      provide: 'ISendEmailQueueJob',
      useExisting: SendEmailQueueJob,
    },
  ],
  exports: ['ISendEmailQueueJob'],
})
export class EmailModule {}
