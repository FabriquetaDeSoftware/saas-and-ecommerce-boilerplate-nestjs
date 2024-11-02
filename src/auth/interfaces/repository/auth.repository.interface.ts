import { SignUpAuthDto } from '@src/auth/dto/sign_up_auth.dto';
import { Auth } from '@src/auth/entities/auth.entity';

export interface IAuthRepository {
  create(signUpAuthDto: SignUpAuthDto): Promise<Auth>;
  findOneByEmail(email: string): Promise<Auth>;
}
