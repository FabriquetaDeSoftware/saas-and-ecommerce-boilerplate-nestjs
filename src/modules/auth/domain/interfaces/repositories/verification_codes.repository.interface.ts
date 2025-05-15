import { VerificationCodes } from '../../entities/verification_codes.entity';

export interface IVerificationCodesRepository {
  findVerificationCodeByAuthorId(
    user_id: number,
  ): Promise<Partial<VerificationCodes>>;

  deleteVerificationCodeByAuthorId(user_id: number): Promise<void>;
}
