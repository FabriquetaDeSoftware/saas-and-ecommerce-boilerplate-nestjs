import { UpdateInfoDto } from 'src/modules/auth/application/dto/update_info.dto';
import { SignUpDefaultDto } from 'src/modules/auth/application/dto/sign_up_default.dto';
import { User } from 'src/shared/entities/user.entity';
import { SignUpMagicLinkDto } from 'src/modules/auth/application/dto/sign_up_magic_link.dto';

export interface IAuthRepository {
  create(
    SignUpDefaultDto: SignUpDefaultDto | SignUpMagicLinkDto,
    code: string,
    expires_at: Date,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;

  findOneByEmail(
    email: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;

  updateInfoByIdAuth(
    id: number,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;

  updateInfoByPublicIdAuth(
    public_id: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;

  updateInfoByEmailAuth(
    email: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>>;
}
