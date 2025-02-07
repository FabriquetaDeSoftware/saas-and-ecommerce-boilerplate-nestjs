import { Module } from '@nestjs/common';
import { EmailSenderService } from './infrastructure/services/email_sender.services';
import { EmailController } from './interface/controllers/email.controller';
import { SendEmailQueueJob } from './infrastructure/jobs/send_email_queue.job';
import { SendEmailConsumerJob } from './infrastructure/jobs/send_email_consumer.job';
import { BullModule } from '@nestjs/bullmq';
import { ProcessHtmlHelper } from './shared/helpers/proccess_html.helper';

@Module({
  imports: [BullModule.registerQueue({ name: 'SEND_EMAIL_QUEUE' })],
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
    ProcessHtmlHelper,
    {
      provide: 'IProcessHtmlHelper',
      useExisting: ProcessHtmlHelper,
    },
  ],
  exports: ['ISendEmailQueueJob'],
})
export class EmailModule {}
