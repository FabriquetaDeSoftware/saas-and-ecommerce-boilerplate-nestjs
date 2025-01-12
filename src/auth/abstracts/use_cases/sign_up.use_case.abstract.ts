import { Inject } from '@nestjs/common';
import { Auth } from 'src/auth/entities/auth.entity';
import { IAuthRepository } from 'src/auth/interfaces/repository/auth.repository.interface';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

export class SignUpUseCaseAbstract {
  @Inject('IAuthRepository')
  protected readonly authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  protected readonly findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IHashUtil')
  protected readonly hashUtil: IHashUtil;
}
