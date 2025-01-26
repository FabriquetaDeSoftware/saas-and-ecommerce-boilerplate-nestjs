import { SignUpDto } from 'src/modules/auth/application/dto/sign_up.dto';
import { Auth } from '../../entities/auth.entity';

export interface ISignUpDefaultUseCase {
  execute(data: SignUpDto): Promise<Auth>;
}
