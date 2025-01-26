import { EmailDto } from 'src/modules/auth/application/dto/email.dto';

export interface ISignInMagicLinkUseCase {
  execute(input: EmailDto): Promise<{ message: string }>;
}
