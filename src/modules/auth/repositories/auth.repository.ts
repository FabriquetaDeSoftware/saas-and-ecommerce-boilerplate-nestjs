import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/sign_up.dto';
import { RolesAuth } from 'src/shared/enum/roles_auth.enum';
import { UpdateInfoDto } from '../dto/update_info.dto';
import { IDatabaseAdapter } from 'src/databases/interfaces/database.adapter.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  @Inject('IDatabaseAdapter')
  private readonly _databaseAdapter: IDatabaseAdapter;

  private readonly _model = 'auth';

  public async create(
    signUpDto: SignUpDto,
    code: string,
    expires_at: Date,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.create<Auth>(this._model, {
      ...signUpDto,
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
    updateInfoDto: Partial<UpdateInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { id: updateInfoDto.id },
      { ...updateInfoDto },
    );

    return { ...result, role: result.role as RolesAuth };
  }
}
