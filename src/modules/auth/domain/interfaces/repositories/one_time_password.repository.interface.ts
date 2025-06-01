import { OneTimePassword } from '../../entities/one_time_password.entity';

export interface IOneTimePasswordRepository {
  create(
    password: string,
    user_id: number,
    expires_at: Date,
  ): Promise<Partial<OneTimePassword>>;

  findOneByUserId(user_id: number): Promise<Partial<OneTimePassword>>;

  deleteByUserId(user_id: number): Promise<void>;
}
