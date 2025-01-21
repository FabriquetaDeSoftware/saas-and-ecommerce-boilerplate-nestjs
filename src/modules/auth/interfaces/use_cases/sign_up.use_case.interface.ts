import { SignUpDto } from '../../dto/sign_up.dto';
import { Auth } from '../../entities/auth.entity';

export interface ISignUpUseCase {
  execute(data: SignUpDto): Promise<Auth>;
}
