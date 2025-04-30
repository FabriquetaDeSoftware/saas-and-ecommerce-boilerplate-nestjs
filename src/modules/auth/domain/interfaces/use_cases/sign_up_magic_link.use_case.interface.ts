import { User } from 'src/shared/entities/user.entity';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

export interface ISignUpPasswordLessUseCase {
  execute(data: SignUpMagicLinkDto): Promise<Partial<User>>;
}
