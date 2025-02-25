import { Inject, Injectable } from '@nestjs/common';
import { RolesEnum } from 'src/shared/enum/roles.enum';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { UpdateInfoDto } from '../../application/dto/update_info.dto';
import { SignUpDefaultDto } from '../../application/dto/sign_up_default.dto';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'auth';

  public async create(
    signUpDefaultDto: SignUpDefaultDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.create<Auth>(this._model, {
      ...signUpDefaultDto,
      verification_code: {
        create: {
          code,
          expires_at,
        },
      },
    });

    return { ...result, role: result.role as RolesEnum };
  }

  public async findOneByEmail(email: string): Promise<Auth> {
    const result = await this._databaseAdapter.findOne<Auth>(this._model, {
      email,
    });

    if (!result) {
      return null;
    }

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByIdAuth(
    id: number,
    updateInfoDto: Partial<UpdateInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { id },
      { ...updateInfoDto },
    );

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByPublicIdAuth(
    public_id: string,
    updateInfoDto: Partial<UpdateInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { public_id },
      { ...updateInfoDto },
    );

    return { ...result, role: result.role as RolesEnum };
  }

  public async updateInfoByEmailAuth(
    email: string,
    updateInfoDto: Partial<UpdateInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { email },
      { ...updateInfoDto },
    );

    return { ...result, role: result.role as RolesEnum };
  }
}
