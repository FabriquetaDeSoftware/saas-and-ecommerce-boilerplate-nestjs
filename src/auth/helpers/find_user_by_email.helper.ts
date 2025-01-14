import { Inject, Injectable } from '@nestjs/common';
import { Auth } from '../entities/auth.entity';
import { IGenericExecute } from '../../shared/interfaces/generic_execute.interface';
import { IAuthRepository } from '../interfaces/repository/auth.repository.interface';

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
