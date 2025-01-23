import { Injectable } from '@nestjs/common';
import { IRecoveryPasswordUseCase } from '../interfaces/use_cases/recovery_password.use_case.interface';

@Injectable()
export class RecoveryPasswordUseCase implements IRecoveryPasswordUseCase {
  public async execute(email: string): Promise<void> {}
}
