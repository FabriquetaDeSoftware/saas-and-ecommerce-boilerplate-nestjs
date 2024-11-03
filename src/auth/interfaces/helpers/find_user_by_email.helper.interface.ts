import { Auth } from '@src/auth/entities/auth.entity';

export interface IFindUserByEmailHelper {
  execute(input: string): Promise<Auth | void>;
}
