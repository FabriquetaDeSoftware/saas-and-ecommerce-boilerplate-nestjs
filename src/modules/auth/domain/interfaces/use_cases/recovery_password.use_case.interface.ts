import { RecoveryPasswordDto } from 'src/modules/auth/application/dto/recovery_password.dto';

export interface IRecoveryPasswordUseCase {
  execute(input: RecoveryPasswordDto): Promise<{ message: string }>;
}
