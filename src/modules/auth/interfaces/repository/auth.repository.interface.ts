import { UpdateInfoDto } from '../../dto/update_info.dto';
import { SignUpDto } from '../../dto/sign_up.dto';
import { Auth } from '../../entities/auth.entity';

export interface IAuthRepository {
  create(signUpDto: SignUpDto, code: string, expires_at: Date): Promise<Auth>;

  findOneByEmail(email: string): Promise<Auth>;

  updateInfoAuth(updateInfoDto: Partial<UpdateInfoDto>): Promise<Auth>;
}
