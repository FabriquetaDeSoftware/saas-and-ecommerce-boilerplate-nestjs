import { Inject, Injectable } from '@nestjs/common';
import { IFindUserByEmailHelper } from '../../domain/interfaces/helpers/find_user_by_email.helper.interface';
import { IAuthRepository } from '../../domain/interfaces/repositories/auth.repository.interface';
import { User } from 'src/shared/entities/user.entity';

@Injectable()
export class FindUserByEmailHelper implements IFindUserByEmailHelper {
  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  public async execute(
    input: string,
    omitFields?: Partial<Record<keyof User, true>>,
  ): Promise<Partial<User>> {
    const findUserByEmail = await this._authRepository.findOneByEmail(input, {
      ...omitFields,
    });

    return findUserByEmail;
  }
}
