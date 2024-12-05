import { SignUpAuthDto } from '../../dto/sign_up_auth.dto';
import { Auth } from '../../entities/auth.entity';

export interface IAuthRepository {
  create(signUpAuthDto: SignUpAuthDto): Promise<Auth>;
  findOneByEmail(email: string): Promise<Auth>;
}
