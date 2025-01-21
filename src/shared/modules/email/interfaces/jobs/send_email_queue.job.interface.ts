import { EmailSenderDto } from '../../dto/email_sender.dto';

export interface ISendEmailQueueJob {
  execute(input: EmailSenderDto): Promise<{ message: string }>;
}
