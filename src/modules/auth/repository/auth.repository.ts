import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Auth } from '../entities/auth.entity';
import { SignUpAuthDto } from '../dto/sign_up_auth.dto';
import { RolesAuth } from 'src/shared/enum/roles_auth.enum';
import { UpdateAuthInfoDto } from '../dto/update_info_auth.dto';
import { DatabaseAdapter } from 'src/databases/adapters/database.adapter';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: DatabaseAdapter;

  private readonly _model = 'auth';

  public async create(
    signUpAuthDto: SignUpAuthDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.create<Auth>(this._model, {
      ...signUpAuthDto,
      verification_code: {
        create: {
          code,
          expires_at,
        },
      },
    });

    return { ...result, role: result.role as RolesAuth };
  }

  public async findOneByEmail(email: string): Promise<Auth> {
    const result = await this._databaseAdapter.findOne<Auth>(this._model, {
      email,
    });

    if (!result) {
      return null;
    }

    return { ...result, role: result.role as RolesAuth };
  }

  public async updateInfoAuth(
    updateAuthInfoDto: Partial<UpdateAuthInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { id: updateAuthInfoDto.id },
      { ...updateAuthInfoDto },
    );

    return { ...result, role: result.role as RolesAuth };
  }
}
