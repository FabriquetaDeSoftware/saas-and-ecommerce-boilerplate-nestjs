import { PasswordDto } from 'src/modules/auth/application/dto/password.dto';

export interface IRecoveryPasswordUseCase {
  execute(token: string, input: PasswordDto): Promise<{ message: string }>;
}
