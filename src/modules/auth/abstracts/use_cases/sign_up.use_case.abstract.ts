import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { IAuthRepository } from '../../interfaces/repository/auth.repository.interface';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { Auth } from '../../entities/auth.entity';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';

export class SignUpUseCaseAbstract {
  @Inject(CACHE_MANAGER)
  protected readonly _cacheManager: Cache;

  @Inject('IAuthRepository')
  protected readonly _authRepository: IAuthRepository;

  @Inject('IFindUserByEmailHelper')
  protected readonly _findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IHashUtil')
  protected readonly _hashUtil: IHashUtil;

  @Inject('IGenerateCodeOfVerificationUtil')
  protected readonly _generateCodeOfVerificationUtil: IGenericExecute<
    void,
    string
  >;
}
