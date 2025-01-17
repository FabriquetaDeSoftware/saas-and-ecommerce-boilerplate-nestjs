import { VerificationCodes } from '@prisma/client';

export interface IVerificationCodesRepository {
  findVerificationCodeByEmail(auth_id: number): Promise<VerificationCodes>;
}
