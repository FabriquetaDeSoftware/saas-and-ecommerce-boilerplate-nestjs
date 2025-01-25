import { VerificationCodes } from '../../entities/verification_codes.entity';

export interface IVerificationCodesRepository {
  findVerificationCodeByEmail(auth_id: number): Promise<VerificationCodes>;
}
