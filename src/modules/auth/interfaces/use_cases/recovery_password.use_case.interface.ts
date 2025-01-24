import { RecoveryPasswordDto } from '../../dto/recovery_password.dto';

export interface IRecoveryPasswordUseCase {
  execute(input: RecoveryPasswordDto): Promise<{ message: string }>;
}
