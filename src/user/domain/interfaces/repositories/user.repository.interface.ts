import { User } from 'src/shared/entities/user.entity';

export interface IUserRepository {
  findOneByPublicId(
    publicUserId: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;
}
