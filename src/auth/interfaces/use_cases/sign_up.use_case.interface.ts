import { Auth } from 'src/auth/entities/auth.entity';
import { SignUpAuthDto } from 'src/auth/dto/sign_up_auth.dto';

export interface ISignUpUseCase {
  execute(input: SignUpAuthDto): Promise<Auth>;
}
