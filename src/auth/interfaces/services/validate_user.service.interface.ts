import { SignInWithCredentialsAuthDto } from '@src/auth/dto/sign_in_auth.dto';
import { Auth } from '@src/auth/entities/auth.entity';

export interface IValidateUserService {
  execute(input: SignInWithCredentialsAuthDto): Promise<Auth>;
}
