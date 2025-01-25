import { VerificationCodeDto } from 'src/modules/auth/application/dto/verification_code.dto';

export interface IVerifyAccountUseCase {
  execute(data: VerificationCodeDto): Promise<{ message: string }>;
}
