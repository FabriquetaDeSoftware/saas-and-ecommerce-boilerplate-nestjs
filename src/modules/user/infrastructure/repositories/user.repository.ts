import { Inject } from '@nestjs/common';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { User } from 'src/shared/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';

export class UserRepository implements IUserRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'user';

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
