import { EmailSenderDto } from '../../dto/email_sender.dto';

export interface IEmailSenderUseCase {
  execute(input: EmailSenderDto): Promise<void>;
}
