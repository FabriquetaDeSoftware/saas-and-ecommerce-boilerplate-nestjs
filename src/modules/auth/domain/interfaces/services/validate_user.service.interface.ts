import { SignInDto } from 'src/modules/auth/application/dto/sign_in.dto';
import { Auth } from '../../entities/auth.entity';

export interface IValidateUserService {
  execute(input: SignInDto): Promise<Auth>;
}
