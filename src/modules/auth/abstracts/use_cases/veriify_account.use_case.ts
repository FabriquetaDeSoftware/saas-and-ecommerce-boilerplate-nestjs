import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { IVerificationCodesRepository } from '../../interfaces/repository/verification_codes.repository.interface';
import { Auth } from '../../entities/auth.entity';
import { IGenericExecute } from 'src/shared/interfaces/generic_execute.interface';
import { IHashUtil } from 'src/shared/utils/interfaces/hash.util.interface';
import { IAuthRepository } from '../../interfaces/repository/auth.repository.interface';

export class VerifyAccountUseCaseAbstract {
  @Inject(CACHE_MANAGER)
  protected readonly _cacheManager: Cache;

  @Inject('IVerificationCodesRepository')
  protected readonly _verificationCodesRepository: IVerificationCodesRepository;

  @Inject('IFindUserByEmailHelper')
  protected readonly _findUserByEmailHelper: IGenericExecute<
    string,
    Auth | void
  >;

  @Inject('IHashUtil')
  protected readonly _hashUtil: IHashUtil;

  @Inject('IAuthRepository')
  protected readonly _authRepository: IAuthRepository;
}
