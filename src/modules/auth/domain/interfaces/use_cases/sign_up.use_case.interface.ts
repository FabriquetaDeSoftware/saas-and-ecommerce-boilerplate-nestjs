import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { Auth } from '../../entities/auth.entity';

export interface ISignUpDefaultUseCase {
  execute(data: SignUpDefaultDto): Promise<Partial<Auth>>;
}
