import { Inject, Injectable } from '@nestjs/common';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { IVerificationCodesRepository } from '../../domain/interfaces/repositories/verification_codes.repository.interface';
import { VerificationCodes } from '../../domain/entities/verification_codes.entity';

@Injectable()
export class VerificationCodesRepository
  implements IVerificationCodesRepository
{
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'verification_code';

  public async findVerificationCodeByAuthorId(
    auth_id: number,
  ): Promise<Partial<VerificationCodes>> {
    const result = await this._databaseAdapter.findOne<VerificationCodes>(
      this._model,
      { auth_id },
    );

    return result;
  }

  public async deleteVerificationCodeByAuthorId(
    auth_id: number,
  ): Promise<void> {
    await this._databaseAdapter.delete(this._model, { auth_id });

    return;
  }
}
