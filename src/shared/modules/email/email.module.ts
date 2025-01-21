import { Module } from '@nestjs/common';
import { EmailSenderUseCase } from './use_cases/email_sender.use_case';
import { EmailController } from './email.controller';
import { SendEmailQueueJob } from './jobs/send_email_queue.job';
import { SendEmailConsumerJob } from './jobs/send_email_consumer.job';
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
    EmailSenderUseCase,
    {
      provide: 'IEmailSenderUseCase',
      useExisting: EmailSenderUseCase,
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
