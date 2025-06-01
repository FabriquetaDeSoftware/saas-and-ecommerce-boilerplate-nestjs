import { OneTimePassword } from '../../entities/one_time_password.entity';

export interface IOneTimePasswordRepository {
  create(): Promise<OneTimePassword>;

  findOneByUserId(user_id: number): Promise<OneTimePassword>;

  deleteByAuthorId(): Promise<void>;
}
