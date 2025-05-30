import { Inject } from '@nestjs/common';
import { IDatabaseAdapter } from 'src/common/modules/databases/interfaces/database.adapter.interface';
import { User } from 'src/shared/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { TablesEnum } from 'src/shared/enum/tables.enum';

export class UserRepository implements IUserRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = TablesEnum.USER;

  public async findOneByPublicId(
    publicUserId: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.findOne<User>(
      this._model,
      {
        public_id: publicUserId,
      },
      { ...omitFields },
    );

    if (!result) {
      return null;
    }

    return result;
  }
}
