import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '@src/auth/entities/auth.entity';
import { IAuthRepository } from '@src/auth/interfaces/repository/auth.repository.interface';
import { IFindUserByEmailHelper } from '@src/auth/interfaces/helpers/find_user_by_email.helper.interface';

@Injectable()
export class FindUserByEmailHelper implements IFindUserByEmailHelper {
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  public async execute(input: string): Promise<Auth | void> {
    const findUserByEmail = await this.authRepository.findOneByEmail(input);

    return findUserByEmail;
  }
}
