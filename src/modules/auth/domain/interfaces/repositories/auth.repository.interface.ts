import { UpdateInfoDto } from 'src/modules/auth/application/dto/update_info.dto';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { Auth } from '../../entities/auth.entity';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

export interface IAuthRepository {
  create(
    SignUpDefaultDto: SignUpDefaultDto | SignUpMagicLinkDto,
    code: string,
    expires_at: Date,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;

  findOneByEmail(
    email: string,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;

  updateInfoByIdAuth(
    id: number,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;

  updateInfoByPublicIdAuth(
    public_id: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;

  updateInfoByEmailAuth(
    email: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof Auth, true>>,
  ): Promise<Partial<Auth>>;
}
