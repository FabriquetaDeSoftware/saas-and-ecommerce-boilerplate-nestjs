import { VerificationCodeAuthDto } from 'src/auth/dto/verification_code_auth.dto';
import { SignUpAuthDto } from '../../dto/sign_up_auth.dto';
import { Auth } from '../../entities/auth.entity';

export interface IAuthRepository {
  create(
    signUpAuthDto: SignUpAuthDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth>;

  findOneByEmail(email: string): Promise<Auth>;
}
