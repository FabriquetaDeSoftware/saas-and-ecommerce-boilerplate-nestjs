import { Inject, Injectable } from '@nestjs/common';
import { RolesEnum } from 'src/shared/enum/rbac.enum';
import { IDatabaseAdapter } from 'src/common/databases/interfaces/database.adapter.interface';
import { IAuthRepository } from '../../domain/interfaces/repository/auth.repository.interface';
import { Auth } from '../../domain/entities/auth.entity';
import { UpdateInfoDto } from '../../application/dto/update_info.dto';
import { SignUpDto } from '../../application/dto/sign_up.dto';

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

  public async updateInfoAuth(
    updateInfoDto: Partial<UpdateInfoDto>,
  ): Promise<Auth> {
    const result = await this._databaseAdapter.update<Auth>(
      this._model,
      { id: updateInfoDto.id },
      { ...updateInfoDto },
    );

    return { ...result, role: result.role as RolesEnum };
  }
}
