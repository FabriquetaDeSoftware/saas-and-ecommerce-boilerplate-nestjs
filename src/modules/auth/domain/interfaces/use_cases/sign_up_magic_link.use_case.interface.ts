import { Auth } from '../../entities/auth.entity';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

export interface ISignUpMagicLinkseCase {
  execute(data: SignUpMagicLinkDto): Promise<Auth>;
}
