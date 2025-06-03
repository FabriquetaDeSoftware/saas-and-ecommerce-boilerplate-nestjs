import { Inject, Injectable } from '@nestjs/common';
import { IOneTimePasswordRepository } from '../../domain/interfaces/repositories/one_time_password.repository.interface';
import { IDatabaseAdapter } from 'src/common/modules/databases/interfaces/database.adapter.interface';
import { OneTimePassword } from '../../domain/entities/one_time_password.entity';
import { TablesEnum } from 'src/shared/enum/tables.enum';

@Injectable()
export class OneTimePasswordRepository implements IOneTimePasswordRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = TablesEnum.ONE_TIME_PASSWORD;

  public async create(
    password: string,
    user_id: number,
    expires_at: Date,
  ): Promise<Partial<OneTimePassword>> {
    const result = await this._databaseAdapter.create<OneTimePassword>(
      this._model,
      {
        password,
        user_id,
        expires_at,
      },
    );

    return result;
  }

  public async findOneByUserId(
    user_id: number,
  ): Promise<Partial<OneTimePassword>> {
    const result = await this._databaseAdapter.findOne<OneTimePassword>(
      this._model,
      { user_id },
    );

    return result;
  }

  public async deleteByUserId(user_id: number): Promise<void> {
    await this._databaseAdapter.delete(this._model, { user_id });

    return;
  }
}
