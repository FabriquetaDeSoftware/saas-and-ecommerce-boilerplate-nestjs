import { Module } from '@nestjs/common';
import { EmailSenderService } from './infrastructure/services/email_sender.services';
import { EmailController } from './interface/controllers/email.controller';
import { SendEmailQueueJob } from './infrastructure/jobs/send_email_queue.job';
import { SendEmailConsumerJob } from './infrastructure/jobs/send_email_consumer.job';
import { BullModule } from '@nestjs/bullmq';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' }),
    SharedModule,
  ],
  controllers: [EmailController],
  providers: [
    SendEmailConsumerJob,
    EmailSenderService,
    {
      provide: 'IEmailSenderService',
      useExisting: EmailSenderService,
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
