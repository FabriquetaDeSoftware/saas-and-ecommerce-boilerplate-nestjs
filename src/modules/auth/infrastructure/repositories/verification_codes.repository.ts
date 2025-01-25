import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { IVerificationCodesRepository } from '../../domain/interfaces/repository/verification_codes.repository.interface';
import { VerificationCodes } from '../../domain/entities/verification_codes.entity';

@Injectable()
export class VerificationCodesRepository
  implements IVerificationCodesRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

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
