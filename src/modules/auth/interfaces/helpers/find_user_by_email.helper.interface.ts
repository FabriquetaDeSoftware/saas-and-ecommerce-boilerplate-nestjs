import { Auth } from '../../entities/auth.entity';

export interface IFindUserByEmailHelper {
  execute(input: string): Promise<Auth | void>;
}
