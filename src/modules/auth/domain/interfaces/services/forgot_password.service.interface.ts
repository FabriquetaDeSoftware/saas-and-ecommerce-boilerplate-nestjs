import { EmailDto } from 'src/modules/auth/application/dto/email.dto';

export interface IForgotPasswordService {
  execute(email: EmailDto): Promise<{ message: string }>;
}
