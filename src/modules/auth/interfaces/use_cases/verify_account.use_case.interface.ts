import { VerificationCodeDto } from '../../dto/verification_code.dto';

export interface IVerifyAccountUseCase {
  execute(data: VerificationCodeDto): Promise<{ message: string }>;
}
