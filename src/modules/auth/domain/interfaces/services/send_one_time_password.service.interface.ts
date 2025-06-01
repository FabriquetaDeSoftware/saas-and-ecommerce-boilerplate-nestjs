import { EmailDto } from 'src/modules/auth/application/dto/email.dto';

export interface ISendOneTimePasswordService {
  execute(input: EmailDto): Promise<{ message: string }>;
}
