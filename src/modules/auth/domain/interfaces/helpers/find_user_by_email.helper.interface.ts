import { Auth } from '../../entities/auth.entity';

export interface IFindUserByEmailHelper {
  execute(
    input: string,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;
}
