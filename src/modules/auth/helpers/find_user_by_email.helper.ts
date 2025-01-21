import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';
import { IFindUserByEmailHelper } from '../interfaces/helpers/find_user_by_email.helper.interface';

@Injectable()
export class FindUserByEmailHelper implements IFindUserByEmailHelper {
  @Inject('IAuthRepository')
  private readonly _authRepository: IAuthRepository;

  public async execute(input: string): Promise<Auth | void> {
    const findUserByEmail = await this._authRepository.findOneByEmail(input);

    return findUserByEmail;
  }
}
