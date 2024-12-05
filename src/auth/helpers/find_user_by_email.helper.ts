import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '@src/auth/entities/auth.entity';
import { IAuthRepository } from '@src/auth/interfaces/repository/auth.repository.interface';
import { IGenericExecute } from '@src/shared/interfaces/generic_execute.interface';

@Injectable()
export class FindUserByEmailHelper
  implements IGenericExecute<string, Auth | void>
{
  @Inject('IAuthRepository')
  private readonly authRepository: IAuthRepository;

  public async execute(input: string): Promise<Auth | void> {
    const findUserByEmail = await this.authRepository.findOneByEmail(input);

    return findUserByEmail;
  }
}
