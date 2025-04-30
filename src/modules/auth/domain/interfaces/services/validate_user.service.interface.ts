import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { User } from 'src/shared/entities/user.entity';

export interface IValidateUserService {
  execute(
    input: SignInDefaultDto,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;
}
