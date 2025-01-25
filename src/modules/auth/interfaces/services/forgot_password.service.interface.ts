import { EmailDto } from '../../dto/email.dto';

export interface IForgotPasswordService {
  execute(email: EmailDto): Promise<{ message: string }>;
}
