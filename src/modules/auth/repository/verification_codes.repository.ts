import { Inject, Injectable } from '@nestjs/common';
import { VerificationCodes } from '../entities/verification_codes.entity';
import { IVerificationCodesRepository } from '../interfaces/repository/verification_codes.repository.interface';
import { DatabaseAdapter } from 'src/databases/adapters/database.adapter';

@Injectable()
export class VerificationCodesRepository
  implements IVerificationCodesRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: DatabaseAdapter;

  private readonly _model = 'verificationCodes';

  public async findVerificationCodeByEmail(
    auth_id: number,
  ): Promise<VerificationCodes> {
    const result = await this._databaseAdapter.findOne<VerificationCodes>(
      this._model,
      { auth_id },
    );

    return result;
  }
}
