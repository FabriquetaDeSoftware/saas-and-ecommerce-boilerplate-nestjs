import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { Auth } from '../../entities/auth.entity';

export interface IValidateUserService {
  execute(
    input: SignInDefaultDto,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;
}
