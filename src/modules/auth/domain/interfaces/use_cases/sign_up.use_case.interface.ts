import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { User } from 'src/shared/entities/user.entity';

export interface ISignUpDefaultUseCase {
  execute(data: SignUpDefaultDto): Promise<Partial<User>>;
}
