import { VerificationCodes } from '../../entities/verification_codes.entity';

export interface IVerificationCodesRepository {
  findVerificationCodeByAuthorId(
    auth_id: number,
  ): Promise<Partial<VerificationCodes>>;

  deleteVerificationCodeByAuthorId(auth_id: number): Promise<void>;
}
