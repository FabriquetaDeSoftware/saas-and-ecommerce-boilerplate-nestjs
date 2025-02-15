import { SignInDefaultDto } from 'src/modules/auth/application/dto/sign_in_default.dto';
import { Auth } from '../../entities/auth.entity';

export interface IValidateUserService {
  execute(input: SignInDefaultDto): Promise<Auth>;
}
