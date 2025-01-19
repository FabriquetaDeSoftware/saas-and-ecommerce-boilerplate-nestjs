import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { SendEmailQueueJob } from './jobs/send_email_queue.job';
import { SendEmailConsumerJob } from './jobs/send_email_consumer.job';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' })],
  controllers: [EmailController],
  providers: [
    SendEmailConsumerJob,
    EmailService,
    {
      provide: 'IEmailService',
      useExisting: EmailService,
    },
    SendEmailQueueJob,
    {
      provide: 'ISendEmailQueueJob',
      useExisting: SendEmailQueueJob,
    },
  ],
})
export class EmailModule {}
