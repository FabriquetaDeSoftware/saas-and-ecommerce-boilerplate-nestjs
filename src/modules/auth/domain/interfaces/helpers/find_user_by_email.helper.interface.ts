import { User } from 'src/shared/entities/user.entity';

export interface IFindUserByEmailHelper {
  execute(
    input: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;
}
