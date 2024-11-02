import { SignInAuthDto } from 'src/auth/dto/ sign_in_auth.dto';
import { Auth } from 'src/auth/entities/auth.entity';

export interface ISignInUseCase {
  execute(input: SignInAuthDto): Promise<Auth>;
}
