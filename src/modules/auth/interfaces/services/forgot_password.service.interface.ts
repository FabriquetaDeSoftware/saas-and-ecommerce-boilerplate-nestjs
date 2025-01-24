import { ForgotPasswordDto } from '../../dto/forgot_password.dto';

export interface IForgotPasswordService {
  execute(email: ForgotPasswordDto): Promise<{ message: string }>;
}
