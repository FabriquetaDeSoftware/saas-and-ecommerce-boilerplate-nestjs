import { EmailSenderDto } from '../../../application/dto/email_sender.dto';

export interface IEmailSenderService {
  execute(input: EmailSenderDto): Promise<void>;
}
