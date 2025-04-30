import { Inject, Injectable } from '@nestjs/common';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { User } from 'src/shared/entities/user.entity';
import { UpdateInfoDto } from '../../application/dto/update_info.dto';
import { SignUpDefaultDto } from '../../application/dto/sign_up_default.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'user';

  public async create(
    signUpDefaultDto: SignUpDefaultDto,
    code: string,
    expires_at: Date,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.create<User>(
      this._model,
      {
        ...signUpDefaultDto,
        verification_code: {
          create: {
            code,
            expires_at,
          },
        },
      },
      { ...omitFields },
    );

    return { ...result, role: result.role as RolesEnum };
  }

  public async findOneByEmail(
    email: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.findOne<User>(
      this._model,
      {
        email,
      },
      { ...omitFields },
    );

    if (!result) {
      return null;
    }

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByIdAuth(
    id: number,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.update<User>(
      this._model,
      { id },
      { ...updateInfoDto },
      { ...omitFields },
    );

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByPublicIdAuth(
    public_id: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.update<User>(
      this._model,
      { public_id },
      { ...updateInfoDto },
      { ...omitFields },
    );

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByEmailAuth(
    email: string,
    updateInfoDto: Partial<UpdateInfoDto>,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const result = await this._databaseAdapter.update<User>(
      this._model,
      { email },
      { ...updateInfoDto },
      { ...omitFields },
    );

    return { ...result, role: result.role as RolesEnum };
  }
}
