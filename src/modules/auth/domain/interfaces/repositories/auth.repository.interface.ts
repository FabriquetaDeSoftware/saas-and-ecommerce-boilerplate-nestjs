import { UpdateInfoDto } from 'src/modules/auth/application/dto/update_info.dto';
import { SignUpDto } from 'src/modules/auth/application/dto/sign_up.dto';
import { Auth } from '../../entities/auth.entity';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

export interface IAuthRepository {
  create(
    signUpDto: SignUpDto | SignUpMagicLinkDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth>;

  findOneByEmail(email: string): Promise<Auth>;

  updateInfoAuth(updateInfoDto: Partial<UpdateInfoDto>): Promise<Auth>;
}
